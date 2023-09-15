import { Router } from "express";
import { register } from "../controllers/auth";
import { check } from "express-validator";
import { recolectarErrores } from "../middlewares/recolectarErrores";
import { existeEmail } from "../helpers/validationsDB";

const router = Router()

router.post("/register",
    [
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check("email", "El email es obligatotrio").isEmail(),
        check("password", "El password debe tener 6 mínimo caracteres").isLength({
            min: 6
        }),
        check("email").custom(existeEmail), //checkeo el email con mi funcion personalizada
        recolectarErrores
    ],
    register)

export default router