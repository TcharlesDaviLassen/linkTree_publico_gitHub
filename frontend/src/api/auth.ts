import axios from "axios";
import Swal from 'sweetalert2'

const API_URL = "http://localhost:5000/api";

export async function login(email: string, password: string) {
  try {
    if (email.trim() === '' || password.trim() === '') throw new Error("Preencha os campos");

    email = email.toLowerCase();
    password = password.toLowerCase();

    const res = await axios.post(`${API_URL}/login`, { email, password });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify({ user: { email: email, password: password } }));
  } catch (e: any) {
    if (!!e.response) {
      throw new Error(e.response.data.error)
    } else {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
    }
  }
}

export async function register(email: string, password: string) {
  if (email.trim() === '' || password.trim() === '') throw new Error("Preencha os campos");

  email = email.toLowerCase();
  password = password.toLowerCase();

  const res = await axios.post(`${API_URL}/register`, { email, password });
  localStorage.setItem("token", res.data.token);
  localStorage.setItem("user", JSON.stringify({ user: { email: email, password: password } }));
}

export function getToken() {
  return localStorage.getItem("token");
}

export function logout() {
  Swal.fire({
    title: "SAIR ?",
    html: "<h6>VOCÊ IRÁ SAIR DA APLICAÇÃO</h6>",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    cancelButtonText: "CANCELAR",
    confirmButtonText: "SAIR"
  }).then((result: { isConfirmed: boolean; }) => {
    if (result.isConfirmed) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      const login = window.location.origin + "/login";

      return window.location.replace(login)
    }
  });
}
