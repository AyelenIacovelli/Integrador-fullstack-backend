import { NextFunction, Request, Response } from "express";
import { ValidationError, Result, validationResult } from "express-validator"

//Recolecta todos los errores o sigue de largo si esta todo bien
export const recolectarErrores = (req: Request, res: Response, next: NextFunction): void => {
    console.log("llegue");
    
    const errors: Result<ValidationError> = validationResult(req)
    // MENSAJE DE BAD REQUEST
    if (!errors.isEmpty()) {
        res.status(400).json(errors)
    } else {
        next()
    }
}