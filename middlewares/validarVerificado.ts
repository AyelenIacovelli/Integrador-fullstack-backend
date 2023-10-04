import { NextFunction, Request, Response } from "express";

export const isVerified = (req: Request, res: Response, next: NextFunction) => {
    console.log("verified");
    
    const { verified } = req.body.usuarioConfirmado
    if (!verified) {
        res.status(401).json({
            msg: "El usuario está correctamente verificado"
        })
        return
    }
    next()
}