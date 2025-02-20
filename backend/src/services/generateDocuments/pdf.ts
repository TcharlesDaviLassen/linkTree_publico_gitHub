import express, { Request, Response } from "express";
import puppeteer from "puppeteer";

import { getInvestments } from "@src/repositories/investmentRepository";

// @ts-ignore
export const pdfServce = async (req: Request, res: Response) => {
    const investments = await getInvestments();

    if (investments.length === 0) {
        return res.status(400).send("Nenhum investimento disponível para gerar PDF.");
    }

    const html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
          <meta charset="UTF-8">
          <title>Extrato de Investimentos</title>
          <style>
              body { font-family: Arial, sans-serif; margin: 20px; padding: 20px; background-color: #fff; }
              h2 { text-align: center; color: #333; }
              table { width: 100%; border-collapse: collapse; background: #fff; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
              th { background-color: #007BFF; color: white; }
              tr:nth-child(even) { background-color: #f2f2f2; }
          </style>
      </head>
      <body>
          <h2>Extrato de Investimentos</h2>
          <table>
              <thead>
                  <tr>
                      <th>Tipo Investimento</th>
                      <th>Tempo de Investimento (mes)es</th>
                      <th>Taxa Anual</th>
                      <th>Investido</th>
                      <th>Rendimento Mensal</th>
                      <th>Rendimento Anual</th>
                      <th>Imposto de Renda</th>
                      <th>Desconto B3</th>
                      <th>Rendimento/Tempo Investido</th>
                  </tr>
              </thead>
              <tbody>
                  ${investments.map((inv, index) => `
                      <tr style="background-color: ${index % 2 === 0 ? '#f2f2f2' : 'white'};">
                          <td>${inv.tipoInvestimento}</td>
                          <td>${inv.tempoInvestimento}</td>
                          <td>${inv.taxaAnual.toFixed(2)}%</td>
                          <td>R$ ${inv.investido.toFixed(2)}</td>
                          <td>R$ ${inv.retornoMensal.toFixed(2)}</td>
                          <td>R$ ${inv.retornoAnual.toFixed(2)}</td>
                          <td>R$ ${inv.impostoRenda.toFixed(2)}</td>
                          <td>R$ ${inv.descontoB3.toFixed(2)}</td>
                          <td>R$ ${inv.rendimentoTempoInvestido.toFixed(2)}</td>
                      </tr>
                  `).join("")}
              </tbody>
          </table>
      </body>
      </html>
    `;

    // Iniciar Puppeteer no modo headless para gerar o PDF
    const browser = await puppeteer.launch({
        headless: 'shell',
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // Aguarde até que a tabela seja carregada na página
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Definir o conteúdo HTML e espera a página carregar
    await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 10000 });

    // Gera PDF em formato especificado
    const pdfBuffer = await page.pdf({ format: "ledger", printBackground: true });

    await browser.close();

    // Configurar cabeçalhos corretamente
    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=investments.pdf",
        "Content-Length": pdfBuffer.length,
    });

    // Enviar PDF como resposta
    return res.end(pdfBuffer);
}