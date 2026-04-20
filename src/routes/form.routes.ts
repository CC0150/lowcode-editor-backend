import { Router } from "express";
import { saveForm, getForm } from "../controllers/form.controller.js";

const router = Router();

router.post("/", saveForm);
router.get("/:formId", getForm);

export default router;