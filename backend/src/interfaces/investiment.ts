export interface Investment {
  id: number;
  investido: number;
  taxaAnual: number;
  tempoInvestimento: number;
  tipoInvestimento: string;
  retornoMensal: number;
  retornoAnual: number;
  impostoRenda: number;
  descontoB3: number;
  rendimentoTempoInvestido: number;
}
