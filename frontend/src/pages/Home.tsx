import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, logout } from "../api/auth";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!getToken()) {
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
