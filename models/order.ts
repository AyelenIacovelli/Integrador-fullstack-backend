import { Model, Schema, Types, model } from "mongoose"

interface IItem {
    desc: String
    id: Number
    price: Number
    quantity: Number
    title: String
}

interface IShippingDetails {
    name: String
    cellphone: String
    location: String
    adress: String
    province: String
    postalCode: Number
}

export interface IOrder {
    createdAt: Date //para saber cuando se crea el documento
    user: Types.ObjectId //id de un objeto que está guardado en otra colección (en mi DB)
    price: Number
    shippingCost: Number
    items: IItem[]
    shippingDetails: IShippingDetails
    status: String
    total: Number
}

const OrderSchema = new Schema<IOrder>({
    createdAt: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario', //en qué colección está mi object id
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    shippingCost: {
        type: Number,
        required: true,
    },
    items: {
        type: [{
            desc: {
                type: String,
                required: true,
            },
            id: {
                type: Number,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            title: {
                type: String,
                required: true,
            },
        }],
        required: true,
    },
    shippingDetails: {
        name: {
            type: String,
            required: true,
        },
        cellphone: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        province: {
            type: String,
            required: true,
        },
        postalCode: {
            type: Number,
            required: true,
        },
    },
    status: {
        type: String,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
});

const Order: Model<IOrder> = model<IOrder>("Order", OrderSchema);

export default Order;