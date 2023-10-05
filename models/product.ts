import { Model, Schema, model } from "mongoose";

export interface IProduct {
    desc?: String;
    id: Number;
    price?: Number; // Hacer price opcional
    pricesale?: Number; // Agregar pricesale como opcional
    quantity: Number;
    title: String;
}

const ProductSchema = new Schema<IProduct>({
    desc: {
        type: String,
        // required: [true, "El nombre del producto es obligatorio"]
    },
    id: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    pricesale: {
        type: Number,
    },
    quantity: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
});

const Product: Model<IProduct> = model<IProduct>("Product", ProductSchema);

export default Product;