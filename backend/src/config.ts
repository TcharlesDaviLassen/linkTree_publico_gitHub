import dotenv from "dotenv";
import path, { dirname } from 'node:path';
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, './.env') })

export const PORT = process.env.PORT || 5000;
export const JWT_SECRET = process.env.JWT_SECRET || "secret";
