import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";

const prisma = new PrismaClient();

export interface InvestimentoDiario {
    tipoInvestimento: string;
    valor: number;
    data: string;
}

export async function register(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    return prisma.user.create({
        data: { email, password: hashedPassword },
    });
}

export async function login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error("Credenciais inválidas");
    }

    return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
}