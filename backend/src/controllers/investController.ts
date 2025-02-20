import { deleteInvestment, getInvestments } from "@src/repositories/investmentRepository";
import { csvService } from "@src/services/generateDocuments/csv";
import { pdfServce } from "@src/services/generateDocuments/pdf";
import { createInvestmentService, updateInvestment } from "@src/services/investiment/investimentService";
import { Request, Response } from "express";

// Lista todos os investimentos
export const listAllInvestments = async (_: Request, res: Response) => {
    const investments = await getInvestments();
    res.json(investments);
};

// Rota para adicionar um novo investimento
export const createInvestments = async (req: Request, res: Response) => {
    try {
        const savedInvestment = await createInvestmentService(req, res);
        res.json(savedInvestment);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

// Rota para atualizar o registro de investiemento
export const updateInvestmentsId = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const updatedInvestment = await updateInvestment(id, req.body);

    res.json(updatedInvestment);
};

// Rota para deletar o registro de investimento
export const deleteInvestmentsId = async (req: Request, res: Response) => {
    try {
        await deleteInvestment(Number(req.params.id));
        res.status(204).send();
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// Gerar CSV
export const investmentsCsv = async (req: Request, res: Response) => {
    await csvService(res);
};

// Gerar PDF
export const investmentsPdf = async (req: Request, res: Response) => {
    try {
        await pdfServce(req, res);
    } catch (error) {
        console.error("Erro ao gerar PDF:", error);
        res.status(500).send("Erro ao gerar PDF");
    }
};

