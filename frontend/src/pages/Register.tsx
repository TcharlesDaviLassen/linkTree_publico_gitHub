import { useState } from "react";
// import { register } from "../api/auth.ts";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useAuth } from "../context/AuthContext.tsx";

export const Register: React.FC = () => {
  const { register } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function handleRegister() {
    try {
      await register(email, password);
      navigate("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        withReactContent(Swal).fire({
          title: <h1>Erro ao fazer registro !</h1>,
          html: <h5>{error.message}</h5>,
        });
      } else {
        alert("Erro desconhecido ao fazer registro");
      }
    }
  }

  function handleBack() {
    navigate("/");
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <h2 className="flex text-lg font-bold mb-4">Registrar</h2>
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
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="home email webauthn"
          required={true}
        />

        <input
          className="border p-2 w-full mb-2 rounded"
          type="password"
          placeholder="Senha"
          onChange={(e) => setPassword(e.target.value)}
          required={true}
        />

        <div className="flex gap-2">
          <button
            onClick={handleBack}
            className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-800"
          >
            Voltar
          </button>

          <button
            onClick={handleRegister}
            className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-800"
          >
            Registrar/Entrar
          </button>
        </div>
      </div>
    </div>
  );
};
