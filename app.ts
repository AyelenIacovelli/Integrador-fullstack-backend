import dotenv from "dotenv"
import { Server } from "./models/server"

// CONFIGURACION DE DOTENV
dotenv.config()

// CREO INSTANCIA DE SERVIDOR
const server = new Server()

// CORRO SERVIDOR
server.listen()