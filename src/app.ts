import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import aiRoutes from "./routes/ai.routes.js";
import formRoutes from "./routes/form.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const router = express.Router();
router.use("/forms", formRoutes); // 处理 /api/forms
router.use("/", aiRoutes);        // 处理 /api/generate-form 等

app.use("/api", router); // 统一入口

export default app;