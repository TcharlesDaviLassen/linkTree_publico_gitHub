import { Request, Response } from "express";

import { Investment } from "@src/interfaces/investiment";
import { createInvestment, getInvestmentById, updateInvestmentId } from "@src/repositories/investmentRepository";

// Retorna a alícota em relação ao tempo de investimento
function alicota(tempoMeses: number): number {
    let aliquota: number;

    switch (true) {
        case tempoMeses <= 6:
            aliquota = 0.225; // 22.5%
            break;
        case tempoMeses <= 12:
            aliquota = 0.20; // 20%
            break;
        case tempoMeses <= 24:
            aliquota = 0.175; // 17.5%
            break;
        default:
            aliquota = 0.15; // 15%
            break;
    }

    return aliquota;
}

// Função para calcular os retornos proporcionalmente ao tempo de investimento
export let calculosRetornados = async (investment: Omit<Investment, "id">) => {
    let { investido, taxaAnual, tempoInvestimento, tipoInvestimento } = investment;

    tipoInvestimento = tipoInvestimento.toUpperCase();

    if (investido <= 0 || taxaAnual <= 0 || tempoInvestimento <= 0) {
        investido = 0
    }

    let retornoMensal = 0;
    let retornoAnual = 0;
    let impostoRenda = 0;
    let descontoB3 = 0;
    let rendimentoTempoInvestido = 0;

    let taixaB3 = 0.002;
    let alicotaPercent = alicota(tempoInvestimento);

    let taixaJutosMensal = (Math.pow(1 + (taxaAnual / 100), (1 / 12))) - 1;

    let calculoFinalComJurosComposto = (investido * Math.pow(1 + taixaJutosMensal, tempoInvestimento));

    let b3 = calculoFinalComJurosComposto * (taixaB3 * (tempoInvestimento / 12));
    let rendimentoTributavel = calculoFinalComJurosComposto - investido;
    let trib_ir = Number((rendimentoTributavel * alicotaPercent).toFixed(2));

    // let m_liquido = calculoFinalComJurosComposto - trib_ir - b3;

    let percentualRetonoAnual = (taxaAnual / 100);
    let mAnual = investido * (1 + percentualRetonoAnual)
    let anual = (tempoInvestimento / 12)
    let rMensal = (1 + percentualRetonoAnual) ** (anual / tempoInvestimento) - 1

    let mMensal = Number((Number((investido * (1 + rMensal) ** (tempoInvestimento)).toFixed(2)) - Number(investido)).toFixed(2)) / tempoInvestimento

    let m_rendimento_liquido = tipoInvestimento !== "LCA" ?
        Number((calculoFinalComJurosComposto - investido - trib_ir - b3).toFixed(2)) :
        Number((Number(((investido * (1 + rMensal) ** (tempoInvestimento))).toFixed(2)) - Number(investido)).toFixed(2));

    retornoMensal = Number(mMensal.toFixed(2));
    retornoAnual = mAnual - investido;
    impostoRenda = tipoInvestimento !== 'LCA' && tipoInvestimento !== 'LCI' ? trib_ir : 0;
    descontoB3 = tipoInvestimento !== 'LCA' && tipoInvestimento !== 'LCI' ? Number(b3.toFixed(2)) : 0;
    rendimentoTempoInvestido = m_rendimento_liquido

    return { ...investment, retornoMensal, retornoAnual, impostoRenda, descontoB3, rendimentoTempoInvestido };
};

// Atualizar um investimento existente
export const updateInvestment = async (id: number, dadosdAtualizados: Partial<Investment>) => {

    const investimentoExistentesBanco = await getInvestmentById(id);
    if (!investimentoExistentesBanco) {
        throw new Error("Investment not found");
    }

    const updated = await calculosRetornados({ ...investimentoExistentesBanco, ...dadosdAtualizados });
    return await updateInvestmentId(id, updated);
};

export const createInvestmentService = async (req: Request, res: Response) => {
    let { tipoInvestimento, tempoInvestimento, investido, taxaAnual } = req.body;

    // Validação de entrada
    if (!investido || !taxaAnual || !tempoInvestimento) {
        return res.status(400).json({ error: "Os campos 'investido', 'taxaAnual' e 'tempoInvestimento' são obrigatórios." });
    }

    // Normalizando tipo de investimento
    tipoInvestimento = tipoInvestimento ? tipoInvestimento.toUpperCase() : "DESCONHECIDO";

    investido = Number(investido);
    taxaAnual = Number(taxaAnual);
    tempoInvestimento = Number(tempoInvestimento);

    // Criando o novo investimento
    const newInvestment: Omit<Investment, "id" | "createdAt" | "updatedAt"> = await calculosRetornados({
        investido,
        taxaAnual,
        tempoInvestimento,
        tipoInvestimento,
        retornoMensal: 0,
        retornoAnual: 0,
        impostoRenda: 0,
        descontoB3: 0,
        rendimentoTempoInvestido: 0
    });

    try {
        return await createInvestment(newInvestment);
    } catch (error) {
        throw new Error("Erro ao salvar investimento.");
    }
}