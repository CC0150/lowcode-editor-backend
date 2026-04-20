import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import aiRoutes from "./routes/ai.routes.js";
import formRoutes from "./routes/form.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 挂载业务路由
app.use("/api", aiRoutes);           // 将匹配 /api/generate-form, /api/patch-form 等
app.use("/api/forms", formRoutes);   // 将匹配 /api/forms 及其子路由

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});