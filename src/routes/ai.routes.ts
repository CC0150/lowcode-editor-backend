import { Router } from "express";
import { generateForm, patchForm, modifyComponent, generateRegex } from "../controllers/ai.controller.js";

const router = Router();

router.post("/generate-form", generateForm);
router.post("/patch-form", patchForm);
router.post("/modify-component", modifyComponent);
router.post("/generate-regex", generateRegex);

export default router;