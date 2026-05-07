import type { Request, Response } from "express";
import { openai } from "../config/openai.js";
import {
    SYSTEM_PROMPT,
    buildPatchPrompt,
    buildModifyComponentPrompt,
    buildRegexPrompt
} from "../constants/prompts.js";
import dotenv from "dotenv";

dotenv.config();

const AI_MODEL = process.env.AI_MODEL || "deepseek-v4-flash";

// 1. 全新生成表单 (SSE 流式)
export const generateForm = async (req: Request, res: Response) => {
    const { prompt } = req.body;

    if (!prompt) return res.status(400).json({ error: "参数缺失" });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
        const stream = await openai.chat.completions.create({
            model: AI_MODEL,
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: prompt },
            ],
            stream: true,
            temperature: 0.1,
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
                res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
        }
        res.write("data: [DONE]\n\n");
        res.end();
    } catch (error) {
        console.error("OpenAI API Error:", error);
        res.write(`data: ${JSON.stringify({ error: "大模型生成失败，请查看后端日志" })}\n\n`);
        res.end();
    }
};

// 2. 局部增删改 (SSE 流式)
export const patchForm = async (req: Request, res: Response) => {
    const { prompt, currentComponents } = req.body;

    if (!prompt) return res.status(400).json({ error: "参数缺失" });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
        const stream = await openai.chat.completions.create({
            model: AI_MODEL,
            messages: [
                { role: "user", content: buildPatchPrompt(currentComponents, prompt) },
            ],
            stream: true,
            temperature: 0.1,
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
                res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
        }
        res.write("data: [DONE]\n\n");
        res.end();
    } catch (error) {
        res.write(`data: ${JSON.stringify({ error: "大模型增量修改失败" })}\n\n`);
        res.end();
    }
};

// 3. 局部修改单个组件属性 (JSON)
export const modifyComponent = async (req: Request, res: Response) => {
    const { component, prompt } = req.body;
    if (!component || !prompt) return res.status(400).json({ error: "参数缺失" });

    try {
        const response = await openai.chat.completions.create({
            model: AI_MODEL,
            messages: [
                { role: "user", content: buildModifyComponentPrompt(component, prompt) },
            ],
            temperature: 0.1,
        });

        let rawJson = response.choices[0]?.message?.content || "{}";
        rawJson = rawJson.replace(/```json/g, "").replace(/```/g, "").trim();

        res.json({ success: true, data: JSON.parse(rawJson) });
    } catch (error) {
        res.status(500).json({ success: false, message: "AI 修改组件失败" });
    }
};

// 4. AI 正则生成 (JSON)
export const generateRegex = async (req: Request, res: Response) => {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "参数缺失" });

    try {
        const response = await openai.chat.completions.create({
            model: AI_MODEL,
            messages: [
                { role: "user", content: buildRegexPrompt(prompt) },
            ],
            temperature: 0.1,
        });

        let rawJson = response.choices[0]?.message?.content || "{}";
        rawJson = rawJson.replace(/```json/g, "").replace(/```/g, "").trim();

        res.json({ success: true, data: JSON.parse(rawJson) });
    } catch (error) {
        res.status(500).json({ success: false, message: "AI 正则生成失败" });
    }
};