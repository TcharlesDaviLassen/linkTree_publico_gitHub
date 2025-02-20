import { PrismaClient } from "@prisma/client";
import { Investment } from "@src/interfaces/investiment";

const prisma = new PrismaClient();

export const createInvestment = async (data: Omit<Investment, "id" | "createdAt" | "updatedAt">) => {
    return await prisma.investment.create({ data });
};

export const getInvestments = async () => {
    return await prisma.investment.findMany();
};

export const getInvestmentById = async (id: number) => {
    return await prisma.investment.findUnique({ where: { id } });
};

export const updateInvestmentId = async (id: number, data: Partial<Omit<Investment, "id" | "createdAt">>) => {
    const { ...updateData } = data;

    if (updateData.taxaAnual !== undefined) updateData.taxaAnual = Number(updateData.taxaAnual) || 0;
    if (updateData.tempoInvestimento !== undefined) updateData.tempoInvestimento = Number(updateData.tempoInvestimento) || 0;
    if (updateData.investido !== undefined) updateData.investido = Number(updateData.investido) || 0;
    if (updateData.retornoMensal !== undefined) updateData.retornoMensal = Number(updateData.retornoMensal) || 0;
    if (updateData.retornoAnual !== undefined) updateData.retornoAnual = Number(updateData.retornoAnual) || 0;
    if (updateData.impostoRenda !== undefined) updateData.impostoRenda = Number(updateData.impostoRenda) || 0;
    if (updateData.descontoB3 !== undefined) updateData.descontoB3 = Number(updateData.descontoB3) || 0;
    if (updateData.rendimentoTempoInvestido !== undefined) updateData.rendimentoTempoInvestido = Number(updateData.rendimentoTempoInvestido) || 0;

    return await prisma.investment.update({
        where: { id },
        data: updateData,
    });
};

export const deleteInvestment = async (id: number) => {
    return await prisma.investment.delete({ where: { id } });
};

export const deleteInvestmentAll = async () => {
    return await prisma.investment.deleteMany({})
};