import express, { Express } from "express"
import cors from "cors"
import authRoutes from "../routes/auth"
import { dbConnection } from "../database/config"
import ordersRoutes from "../routes/orders"

export class Server {

    // TIPADO
    app: Express
    port: string | number | undefined
    authPath: string
    ordersPath: string

    // CONSTRUCTOR
    constructor() {
        this.app = express()
        this.port = process.env.PORT
        this.authPath = '/auth'
        this.ordersPath = '/orders'
        this.conectarDB()
        this.middlewares()
        this.routes()
    }

    // CONEXION A BASE DE DATOS
    async conectarDB(): Promise<void> {
        await dbConnection()
    }

    // MIDDLEWARES
    middlewares(): void {
        this.app.use(express.json())
        this.app.use(cors({origin:"https://integrador-fullstack-frontend.vercel.app", methods:"GET,HEAD,PUT,PATCH,POST,DELETE"})) //me asegura que nadie que yo no quiera se conecte a mi api ni que manden metodos http que no quiera
    }

    // RUTAS
    routes(): void {
        this.app.use(this.authPath, authRoutes)
        this.app.use(this.ordersPath, ordersRoutes)
    }

    // LEVANTO BASE DE DATOS
    listen(): void {
        this.app.listen(this.port, () => {
            console.log(`Corriendo en puerto ${this.port}`)
        })
    }
}