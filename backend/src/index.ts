import cors from "cors";
import express from "express";
import { PORT } from "./config";
import routes from "./routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", routes);

app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));