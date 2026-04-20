import type { Request, Response } from "express";
import { prisma } from "../store/db.js"; // 确保路径正确

export const saveForm = async (req: Request, res: Response) => {
  try {
    const { title, components } = req.body;

    // 使用 Prisma 写入数据库
    const newForm = await prisma.form.create({
      data: {
        title: title || "未命名表单",
        components: components, // Prisma 会自动处理 Json 类型
      },
    });

    res.json({ success: true, data: { formId: newForm.id } });
  } catch (error) {
    console.error("保存失败:", error);
    res.status(500).json({ success: false, message: "发布失败" });
  }
};

export const getForm = async (req: Request, res: Response) => {
  try {
    const { formId } = req.params;
    const formData = await prisma.form.findUnique({
      where: { id: formId as string },
    });

    if (formData) {
      res.json({ success: true, data: formData });
    } else {
      res.status(404).json({ success: false, message: "表单不存在" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "查询失败" });
  }
};

// 提交表单内容
export const submitFormContent = async (req: Request, res: Response) => {
  try {
    const { formId, content } = req.body;

    if (!formId || !content) {
      return res.status(400).json({ success: false, message: "参数不完整" });
    }

    const submission = await prisma.submission.create({
      data: {
        formId,
        content, // 直接存储前端传来的 JSON 对象
      },
    });

    res.json({ success: true, data: submission });
  } catch (error) {
    console.error("提交失败:", error);
    res.status(500).json({ success: false, message: "提交失败" });
  }
};

// 获取某个表单的所有提交记录
export const getSubmissions = async (req: Request, res: Response) => {
  try {
    const { formId } = req.params;

    const data = await prisma.submission.findMany({
      where: { formId: formId as string },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "获取失败" });
  }
};