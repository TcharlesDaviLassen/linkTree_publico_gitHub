import express from "express";
import { createInvestments, deleteInvestmentsId, investmentsCsv, investmentsPdf, listAllInvestments, updateInvestmentsId } from "@src/controllers/investController";

const investRoutes = express.Router();

// Lista todos os investimentos
investRoutes.get("/investments", listAllInvestments);

// Rota para adicionar um novo investimento
investRoutes.post("/investments", createInvestments);

// Rota para atualizar o registro de investiemento
investRoutes.put("/investments/:id", updateInvestmentsId);

// Rota para deletar o registro de investimento
investRoutes.delete("/investments/:id", deleteInvestmentsId);

// Gerar CSV
investRoutes.get("/investments/csv", investmentsCsv);

// Gerar PDF
investRoutes.get("/investments/pdf", investmentsPdf)

export { investRoutes };
