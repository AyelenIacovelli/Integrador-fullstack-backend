import { Model, Schema, model } from "mongoose"
import { ROLES } from "../helpers/constants"

export interface IUser {
    nombre: string
    email: string
    password: string
    rol?: string //opcional
    code?: string //opcional
    verified?: string //opcional
    cart: {
        product: string; // aquí almacenaremos el ID del producto
        quantity: number;
    }[];
}

const UserSchema = new Schema<IUser>({
    nombre: {
        type: String,
        required: [true, "El nombre es obligatorio"]
    },
    email: {
        type: String,
        required: [true, "El correo es obligatorio"]
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria"]
    },
    rol: {
        type: String,
        default: ROLES.user
    },
    code: {
        type: String
    },
    verified: {
        type: Boolean,
        default: false
    },
    cart: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ]
})

UserSchema.methods.toJSON = function () { //paso la data que traigo de la DB a json
    const { __v, password, _id, code, ...usuario } = this.toObject() //cosas que no quiero que le llegue al usuario final
    return usuario //guardo toda la data menos la seleccion de arriba
}

const Usuario: Model<IUser> = model<IUser>("Usuario", UserSchema) //Usuario es el nombre que le doy a la coleccion de DB

export default Usuario