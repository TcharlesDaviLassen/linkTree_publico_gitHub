import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { InvestmentTable } from "./pages/InvestmentTable.tsx";
import { Home } from "./pages/Home.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/invest" element={<InvestmentTable />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
