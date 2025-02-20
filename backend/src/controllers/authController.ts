import { Request, Response } from "express";
import { login, register } from "../auth";

// Registro
export const registerController = async (req: Request, res: Response) => {
    try {
        const user = await register(req.body.email, req.body.password);
        res.json(user);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// Login
export const loginController = async (req: Request, res: Response) => {
    try {
        const token = await login(req.body.email, req.body.password);
        res.json({ token });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};