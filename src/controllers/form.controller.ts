import type { Request, Response } from "express";
import crypto from "crypto";
import { formStore } from "../store/db.js";

// 发布表单（保存配置）
export const saveForm = (req: Request, res: Response) => {
  try {
    const { title, components } = req.body;
    // 生成一个随机的短 ID
    const formId = crypto.randomBytes(4).toString("hex"); 
    
    // 把表单数据存起来
    formStore.set(formId, { title, components, createdAt: new Date() });
    
    res.json({ success: true, data: { formId } });
  } catch (error) {
    res.status(500).json({ success: false, message: "发布失败" });
  }
};

// 获取表单 (用于独立分享页渲染)
export const getForm = (req: Request, res: Response) => {
  const { formId } = req.params;
  const formData = formStore.get(formId as string);
  
  if (formData) {
    res.json({ success: true, data: formData });
  } else {
    res.status(404).json({ success: false, message: "表单不存在或已失效" });
  }
};