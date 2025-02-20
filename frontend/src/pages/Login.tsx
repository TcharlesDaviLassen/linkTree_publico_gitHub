import { useState } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function handleLogin() {
    try {
      await login(email, password);
      navigate("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        withReactContent(Swal).fire({
          title: <h1>Erro ao fazer o login !</h1>,
          html: <h5>{error.message}</h5>,
        });
      } else {
        alert("Erro desconhecido ao fazer login");
      }
    }
  }

  async function handleRegister() {
    navigate("/register");
  }

  async function tableInvest() {
    navigate("/invest");
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <h2 className="flex text-lg font-bold mb-4">Login</h2>
          <span
            style={{
              display: "flex",
              borderBottom: "1px solid black",
              width: "100%",
            }}
          ></span>
        </div>

        <input
          className="border p-2 w-full mb-2 rounded"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="home email webauthn"
        />

        <input
          className="border p-2 w-full mb-2 rounded"
          type="password"
          placeholder="Senha"
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              onClick={handleLogin}
              className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-800"
            >
              Entrar
            </button>

            <button
              onClick={handleRegister}
              className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-800"
            >
              Registrar
            </button>
          </div>

          <div className="flex flex-row">
            <button
              onClick={tableInvest}
              className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-800"
            >
              Investimento/Tabela
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
