import { Request, Response } from "express";
import { ObjectId } from "mongoose";
import Order, { IOrder } from "../models/order";

export const getOrders = async (req: Request, res: Response) => {
    //para saber qué usuario me pide la orden tengo que usar el token
    const usuarioId: ObjectId = req.body.usuarioConfirmado._id
    const consulta = { user: usuarioId }
    //buscar las ordenes dependiendo el usuario
    const orders = await Order.find(consulta)
    res.status(200).json({
        data: [
            ...orders
        ]
    })
}

export const createOrder = async (req: Request, res: Response) => {
    console.log(req.body);
    
    const usuarioId: ObjectId = req.body.usuarioConfirmado._id
    const orderData: IOrder = req.body
    //creo el objeto que le voy a mandar a la base de datos:
    const data = {
        ...orderData,
        user: usuarioId,
        createdAt: new Date(),
        status: "pending"
    }
    // CREO LA NUEVA ORDEN
    const order = new Order(data)
    console.log(order);
    
    //guardo en base de datos
    await order.save()
    res.status(201).json({
        order
    })
}