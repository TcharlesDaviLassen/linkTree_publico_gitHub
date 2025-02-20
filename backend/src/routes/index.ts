import express from "express";

import { authRoutes } from "./authRoutes";
import { investRoutes } from "./investRoutes";

const router = express.Router();

router.use(authRoutes);

router.use(investRoutes)

export default router;
