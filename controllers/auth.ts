import { Request, Response } from "express"
import Usuario, { IUser } from "../models/user"
import bcryptjs from "bcryptjs"
import { ROLES } from "../helpers/constants"
import randomstring from "randomstring"
import { sendEmail } from "../mailer/mailer"
import { generarJWT } from "../helpers/generarJWT"

export const register = async (req: Request, res: Response) => { //el usuario me tiene que mandar data
    // DATA(TIPADA) QUE ME ENVIA EL USUARIO
    const { nombre, email, password, rol }: IUser = req.body
    // CREO EL NUEVO USUARIO
    const usuario = new Usuario({ nombre, email, password, rol })
    // HASHEO EL PASS QUE ME ENVIA EL USUARIO
    const salt = bcryptjs.genSaltSync()
    usuario.password = bcryptjs.hashSync(password, salt)
    //GUARDO EL ADMIN-KEY
    const adminKey = req.headers["admin-key"]
    //VALIDO ADMIN-KEY(sino pasa como user)
    if (adminKey === process.env.KEYFORADMIN) {
        usuario.rol = ROLES.admin
    }
    // LE GENERO UN CODIGO RANDOM
    const newCode = randomstring.generate(6)
    usuario.code = newCode
    // GUARDO EL USUARIO
    await usuario.save()
    // MANDO MAIL CON CODIGO PARA VERIFICARSE
    await sendEmail(email, newCode)
    // CREADO CON EXITO
    res.status(201).json({
        usuario
    })
}

export const login = async (req: Request, res: Response): Promise<void> => {
    // DATA(TIPADA) QUE ME ENVIA EL USUARIO
    const { email, password }: IUser = req.body
    try {
        //ME INTENTO TRAER EL USUARIO DE LA BASE DE DATOS
        const usuario = await Usuario.findOne({ email })
        //SI NO EXISTE EL USUARIO MANDO MSJ NOT FOUND:
        if (!usuario) {
            res.status(404).json({
                msg: "No se encontró el mail en la base de datos"
            })
            return
        }
        //SI EL USUARIO EXISTE, VALIDO LA CONTRASEÑA
        //(Comparo el pass del usuario con el hash de mi base de datos)
        const validarPassword = bcryptjs.compareSync(password, usuario.password)
        //SI ES INCORRECTA, MNDO MSJ NO AUTORIZADO
        if (!validarPassword) {
            res.status(401).json({
                msg: "La contraseña es incorrecta"
            })
            return
        }
        //SI ESTA TODO OK, SE PUEDE LOGEAR EL USUARIO
        const token = await generarJWT(usuario.id)// Le armo un token al usuario
        //Le mando un msj de Aceptado
        res.status(202).json({
            usuario, //para que el front use la data en redux
            token //lo tiene que guardar porque se lo voy a pedir mas adelante(por ejemplo en órdenes)
        })
    } catch (error) {
        console.log(error);
        //Le mando un mensaje de error genérico no previsto
        res.status(500).json({
            msg: "Error en el servidor"
        })
    }
}

export const verifyUser = async (req: Request, res: Response) => {
    const { email, code } = req.body
    try {
        //chequeo que el usuario exista
        const usuario = await Usuario.findOne({ email })
        if (!usuario) {
            res.status(404).json({
                msg: "No se encontró el mail en la base de datos"
            })
            return
        }
        //chequeo que el usuario no esté verificado
        if (usuario.verified) {
            res.status(400).json({
                msg: "El usuario ya está verificado"
            })
        }
        //chequeo que los códigos coincidan
        if (code !== usuario.code) {
            res.status(401).json({
                msg: "El código ingresado es incorrecto"
            })
            return
        }
        //ACTUALIZO LA VERIFICACION DEL USUARIO
        await Usuario.findOneAndUpdate(
            { email },
            { verified: true }
        )
        res.status(200).json({
            msg: "Usuario verificado con éxito"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Error en el servidor"
        })
    }
}