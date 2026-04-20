import { Router } from "express";
import { saveForm, getForm, submitFormContent, getSubmissions } from "../controllers/form.controller.js";

const router = Router();

router.post("/", saveForm);
router.get("/:formId", getForm);
router.post("/submit", submitFormContent); // 用户填写并提交
router.get("/:formId/submissions", getSubmissions); // 管理员查看提交的内容

export default router;