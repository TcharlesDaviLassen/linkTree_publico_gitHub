import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        res.status(401).json({ error: "Acesso negado" });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        req.body.userId = decoded.userId;

        next();
    } catch {
        res.status(401).json({ error: "Token inválido" });
        return;
    }
}

export default authMiddleware;