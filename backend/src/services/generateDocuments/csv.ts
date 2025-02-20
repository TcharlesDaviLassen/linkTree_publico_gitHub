import { getInvestments } from "@src/repositories/investmentRepository";

import ExcelJS from "exceljs";
import { Response } from "express";
import { calculosRetornados } from "../investiment/investimentService";

export const csvService = async (res: Response) => {
    const investments = await getInvestments();

    // Criar uma nova planilha
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Investimentos");

    // Definir cabeçalhos com estilo
    worksheet.columns = [
        { header: "Tipo de Investimento", key: "tipoInvestimento", width: 25 },
        { header: "Valor Investido", key: "investido", width: 25 },
        { header: "Taxa Anual", key: "taxaAnual", width: 25 },
        { header: "Tempo de Investimento", key: "tempoInvestimento", width: 25 },
        { header: "Rendimento Mensal", key: "retornoMensal", width: 28 },
        { header: "Rendimento Anual", key: "retornoAnual", width: 28 },
        { header: "Imposto de Renda", key: "impostoRenda", width: 28 },
        { header: "Desconto B3", key: "descontoB3", width: 25 },
        { header: "Rendimento Líquido", key: "rendimentoTempoInvestido", width: 28 },
    ];

    // Estilizar cabeçalho
    worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "0070C0" } }; // Azul
        cell.alignment = { horizontal: "center" };
    });

    // Adicionar os investimentos à planilha
    for (const inv of investments) {
        const calculated = await calculosRetornados(inv);

        const row = worksheet.addRow({
            tipoInvestimento: inv.tipoInvestimento,
            investido: `R$ ${inv.investido.toFixed(2)}`,
            taxaAnual: `${inv.taxaAnual.toFixed(2)}%`,
            tempoInvestimento: `${inv.tempoInvestimento} meses`,
            retornoMensal: `R$ ${calculated.retornoMensal.toFixed(2)}`,
            retornoAnual: `R$ ${calculated.retornoAnual.toFixed(2)}`,
            impostoRenda: `R$ ${calculated.impostoRenda.toFixed(2)}`,
            descontoB3: `R$ ${calculated.descontoB3.toFixed(2)}`,
            rendimentoTempoInvestido: `R$ ${calculated.rendimentoTempoInvestido.toFixed(2)}`
        });

        // Aplicar cores condicionais
        const impostoCell = row.getCell("impostoRenda");
        if (calculated.impostoRenda > 1000) {
            impostoCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0000" } }; // Vermelho
            impostoCell.font = { bold: true, color: { argb: "FFFFFF" } };
        }

        const descontoB3Cell = row.getCell("descontoB3");
        if (calculated.descontoB3 > 50) {
            descontoB3Cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFA500" } }; // Laranja
        }
    }

    // Configurar cabeçalhos de resposta HTTP para download
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=investments.xlsx");

    // Enviar o arquivo
    await workbook.xlsx.write(res);
    res.end();
};