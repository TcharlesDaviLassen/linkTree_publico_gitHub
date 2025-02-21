import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import Swal from "sweetalert2";

const API_URL = "http://localhost:5000/api";

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>(
    localStorage.getItem("token") || ""
  );

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      if (!email.trim() || !password.trim())
        throw new Error("Preencha os campos");

      email = email.toLowerCase();
      password = password.toLowerCase();

      const res = await axios.post<{ token: string }>(`${API_URL}/login`, {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify({ email }));

      setUser({ email });
      setToken(res.data.token);
    } catch (e: any) {
      throw new Error(e.response?.data?.error || e.message);
    }
  };

  const register = async (email: string, password: string): Promise<void> => {
    try {
      if (!email.trim() || !password.trim())
        throw new Error("Preencha os campos");

      email = email.toLowerCase();
      password = password.toLowerCase();

      const res = await axios.post<{ token: string }>(`${API_URL}/register`, {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify({ email }));

      setUser({ email });
      setToken(res.data.token);
    } catch (e: any) {
      throw new Error(e.response?.data?.error || e.message);
    }
  };

  const logout = (): void => {
    Swal.fire({
      title: "SAIR ?",
      html: "<h6>VOCÊ IRÁ SAIR DA APLICAÇÃO</h6>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      cancelButtonText: "CANCELAR",
      confirmButtonText: "SAIR",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setToken("");
        window.location.replace("/login");
      }
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
