import express from 'express'; 
import {register, login, logout} from '../controllers/authController.js'
import { validateRequest } from "../middleware/validateRequest.js";
import { registerSchema, loginSchema } from"../validators/authValidators.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router()

router.post("/register", validateRequest(registerSchema), register);

router.post("/login", validateRequest(loginSchema), login);

router.post("/logout", logout);

router.get("/me", authMiddleware, (req, res) => {
    res.status(200).json({
        status: "success",
        data: {
            user: {
                id: req.user.id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role
            }
        }
    });
});


export default router;