import { Request, Response } from "express"
import Usuario, { IUser } from "../models/user"
import bcryptjs from "bcryptjs"
import { ROLES } from "../helpers/constants"
import randomstring from "randomstring"

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
    // await sendEmail(email, newCode)
    // CREADO CON EXITO
    res.status(201).json({
        usuario
    })
}