import axios from "axios";
import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { getToken, logout } from "../api/auth";

interface Investment {
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

interface InvestmentForm {
  tempoInvestimento: number;
  tipoInvestimento: string;
  investido: number;
  taxaAnual: number;
}

const InvestmentTable: React.FC = () => {
  const navigate = useNavigate();
  const [investments, setInvestments] = useState<Investment[]>([]);

  useEffect(() => {
    if (!getToken()) {
      navigate("/login");
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InvestmentForm>();

  useEffect(() => {
    axios.get("http://localhost:5000/api/investments").then((response) => {
      setInvestments(response.data);
    });
  }, [investments]);

  const updateInvestment = (
    id: number,
    field: keyof Investment,
    value: string
  ) => {
    const updatedInvestments = investments.map((inv) =>
      inv.id === id ? { ...inv, [field]: value } : inv
    );

    setInvestments(updatedInvestments);

    axios
      .put(`http://localhost:5000/api/investments/${id}`, { [field]: value })
      .then((response) => {
        setInvestments((prev) =>
          prev.map((inv) => (inv.id === id ? response.data : inv))
        );
      });
  };

  const onclickDelete = (id: number) => {
    withReactContent(Swal).fire({
      title: <h1>Fazer a exclusão desse registro ?</h1>,
      html: <h6>Não será possivel reverter essa exclusão !</h6>,
      showCancelButton: true,
      cancelButtonColor: "#fb2c36",
      cancelButtonText: "CANCELAR",
      preConfirm: async () => {
        axios
          .delete(`http://localhost:5000/api/investments/${id}`)
          .then((response) => {
            setInvestments((prev) =>
              prev.map((inv) => (Number(inv.id) === id ? response.data : inv))
            );
          });
      },
    });
  };

  const downloadCSV = () => {
    window.open("http://localhost:5000/api/investments/csv", "_blank");
  };

  const downloadPDF = async () => {
    window.open("http://localhost:5000/api/investments/pdf", "_blank");
  };

  const onSubmit = async (data: InvestmentForm) => {
    try {
      const response = await fetch("http://localhost:5000/api/investments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Erro ao enviar os investimentos");
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  async function backLogin() {
    navigate("/");
  }

  async function sair() {
    logout();
  }

  return (
    <>
      {getToken() ? (
        <div className="pb-28">
          <div className="pt-12 h-screen">
            {/*  */}

            <div className="max-w-[90%] mx-auto p-6 bg-gray-100">
              <div className="flex flex-row justify-between">
                <button
                  onClick={backLogin}
                  className="bg-blue-500 text-white p-2 w-24 rounded hover:bg-blue-800 mb-3"
                >
                  Voltar
                </button>

                <button
                  onClick={sair}
                  className="bg-red-500 text-white p-2 w-24 rounded hover:bg-blue-800 mb-3"
                >
                  Sair
                </button>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-6 shadow-md rounded-lg"
              >
                <div className="flex flex-col">
                  <div className="flex">
                    <h4 className="text-xl font-bold mb-4 text-center">
                      Formulário de Investimentos
                    </h4>
                  </div>

                  <div className="flex items-center gap-4 h-[6rem]">
                    <div className="block">
                      <div className="flex flex-row gap-4 h-[6rem]">
                        {/* Tipo de Investimento */}
                        <div className="mb-4">
                          <label className="block text-gray-700">
                            Tipo Investimento:
                          </label>
                          <input
                            type="text"
                            {...register("tipoInvestimento", {
                              required: "Este campo é obrigatório",
                            })}
                            className="w-full p-2 border border-gray-300 rounded"
                          />
                          {errors.tipoInvestimento && (
                            <p className="text-red-500 text-sm">
                              {errors.tipoInvestimento.message}
                            </p>
                          )}
                        </div>

                        {/* Tempo de Investimento */}
                        <div className="mb-4">
                          <label className="block text-gray-700">
                            Tempo Investimento:
                          </label>
                          <input
                            type="text"
                            {...register("tempoInvestimento", {
                              required: "Este campo é obrigatório",
                            })}
                            className="w-full p-2 border border-gray-300 rounded"
                          />
                          {errors.tempoInvestimento && (
                            <p className="text-red-500 text-sm">
                              {errors.tempoInvestimento.message}
                            </p>
                          )}
                        </div>

                        {/* Valor Investido */}
                        <div className="mb-4">
                          <label className="block text-gray-700">
                            Valor Investido (R$):
                          </label>
                          <input
                            type="number"
                            {...register("investido", {
                              required: "Este campo é obrigatório",
                              min: {
                                value: 1,
                                message: "O valor deve ser maior que 0",
                              },
                            })}
                            className="w-full p-2 border border-gray-300 rounded"
                          />
                          {errors.investido && (
                            <p className="text-red-500 text-sm">
                              {errors.investido.message}
                            </p>
                          )}
                        </div>

                        {/* Taxa Anual */}
                        <div className="mb-4">
                          <label className="block text-gray-700">
                            Taxa Anual (% a.a):
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            {...register("taxaAnual", {
                              required: "Este campo é obrigatório",
                              min: {
                                value: 0,
                                message: "A taxa deve ser positiva",
                              },
                            })}
                            className="w-full p-2 border border-gray-300 rounded"
                          />
                          {errors.taxaAnual && (
                            <p className="text-red-500 text-sm">
                              {errors.taxaAnual.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botão de Envio */}
                  <div className="flex w-[8rem] h-[2.5rem]">
                    <button
                      type="submit"
                      className="w-full send-button bg-blue-500 text-white rounded hover:bg-blue-700 transition"
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/*  */}

            <div className="table_container max-w-[90%] mx-auto p-6 bg-gray-100">
              <h4 className="mb-4">Tabela de Investimentos</h4>
              <table className="border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-[12px] border border-gray-300 px-4 py-2">
                      Tipo Investimento
                    </th>
                    <th className="text-[12px] border border-gray-300 px-4 py-2">
                      Tempo Investimento Mes(es)
                    </th>
                    <th className="text-[12px] border border-gray-300 px-4 py-2">
                      Investido
                    </th>
                    <th className="min-w-[6rem] text-[12px] border border-gray-300 px-4 py-2">
                      Taxa Anual
                    </th>
                    <th className="min-w-[10rem] text-[12px] border border-gray-300 px-4 py-2">
                      Rendimento Mensal
                    </th>
                    <th className="min-w-[10rem] text-[12px] border border-gray-300 px-4 py-2">
                      Rendimento Anual
                    </th>
                    <th className="min-w-[10rem] text-[12px] border border-gray-300 px-4 py-2">
                      Imposto de renda
                    </th>
                    <th className="min-w-[10rem] text-[12px] border border-gray-300 px-4 py-2">
                      Desconto B3
                    </th>
                    <th className="min-w-[10rem] text-[12px] border border-gray-300 px-4 py-2">
                      Rendimento/Tempo Investido
                    </th>
                    <th className="text-[12px] border border-gray-300 px-4 py-2">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {investments.map((investment) => (
                    <tr key={investment.id} className="text-center">
                      {/*Input Iterativo TipoInvestimento */}
                      <td
                        data-label="Tipo Investimento"
                        className="text-[12px] border border-gray-300 px-4 py-2"
                      >
                        <input
                          type="text"
                          style={{ textTransform: "uppercase" }}
                          value={investment.tipoInvestimento}
                          onChange={(e) =>
                            updateInvestment(
                              investment.id,
                              "tipoInvestimento",
                              e.target.value
                            )
                          }
                          className="w-full text-end bg-transparent"
                        />
                      </td>

                      {/*Input Iterativo Tempo Investimento */}
                      <td
                        data-label="Tempo Investimento meses"
                        className="text-[12px] border border-gray-300 px-4 py-2"
                      >
                        <input
                          type="text"
                          value={investment.tempoInvestimento}
                          onChange={(e) =>
                            updateInvestment(
                              investment.id,
                              "tempoInvestimento",
                              e.target.value
                            )
                          }
                          className="w-full text-end bg-transparent"
                        />
                      </td>

                      {/*Input Iterativo Quantia investida */}
                      <td
                        data-label="Investido"
                        className="text-[12px] border border-gray-300 px-4 py-2"
                      >
                        <input
                          // type="number"
                          inputMode="numeric"
                          value={investment.investido}
                          onChange={(e) =>
                            updateInvestment(
                              investment.id,
                              "investido",
                              e.target.value
                            )
                          }
                          className="w-full text-end bg-transparent"
                        />
                      </td>

                      {/*Input Iterativo Porcentagem anual de retorno*/}
                      <td
                        data-label="Percentual Anual"
                        className="text-[12px] border border-gray-300 px-4 py-2"
                      >
                        <div className="flex justify-end">
                          <input
                            // type="number"
                            inputMode="numeric"
                            value={investment.taxaAnual}
                            onChange={(e) =>
                              updateInvestment(
                                investment.id,
                                "taxaAnual",
                                e.target.value
                              )
                            }
                            className="w-full text-end bg-transparent"
                          />
                          <span>%</span>
                        </div>
                      </td>

                      {/*Campos Fixos*/}
                      <td
                        data-label="Rendimento Mensal"
                        className="text-[10px] border border-gray-300 px-4 py-2"
                      >
                        R$ {(investment.retornoMensal ?? 0).toFixed(2)}
                      </td>

                      <td
                        data-label="Rendimento Anual"
                        className="text-[10px] border border-gray-300 px-4 py-2"
                      >
                        R$ {(investment.retornoAnual ?? 0).toFixed(2)}
                      </td>

                      <td
                        data-label="Imposto Renda"
                        className="text-[12px] border border-gray-300 px-4 py-2"
                      >
                        R$ {(investment.impostoRenda ?? 0).toFixed(2)}
                      </td>

                      <td
                        data-label="Desconto B3"
                        className="text-[12px] border border-gray-300 px-4 py-2"
                      >
                        R$ {(investment.descontoB3 ?? 0).toFixed(2)}
                      </td>

                      <td
                        data-label="Rendimento/Tempo Investido"
                        className="text-[12px] border border-gray-300 px-4 py-2"
                      >
                        R${" "}
                        {(investment.rendimentoTempoInvestido ?? 0).toFixed(2)}
                      </td>

                      <td
                        data-label="Ações"
                        className="text-[10px] border border-gray-300 px-4 py-2"
                      >
                        <button
                          onClick={() => onclickDelete(investment.id)}
                          className="bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          <span className="material-symbols-outlined delete">
                            delete
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={downloadCSV}
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
                >
                  Baixar CSV
                </button>
                <button
                  onClick={downloadPDF}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Baixar PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-center items-center h-screen">
            <h1 className="font-bold text-3xl">CARREGANDO...</h1>
          </div>
        </>
      )}
    </>
  );
};

export { InvestmentTable };
