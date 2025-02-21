import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// import { getToken, logout } from "../api/auth.ts";
const Home = () => {
  const { token } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      navigate("invest");
    }
  }, []);

  return (
    // <div className="h-screen  flex justify-center items-center">
    //   <h1 className="text-white">HOME</h1>
    // </div>
    <></>
  );
};

export { Home };
