# 低代码编辑器后端服务

## 项目简介

这是一个基于 TypeScript 和 Express 构建的低代码编辑器后端服务，提供 AI 驱动的表单生成、管理和数据处理功能。

### 核心功能

- **AI 表单生成**：使用大模型（如 DeepSeek）根据用户描述生成完整的表单配置
- **表单管理**：保存、获取表单配置
- **表单提交**：处理用户提交的表单数据
- **数据管理**：获取表单的所有提交记录
- **AI 组件修改**：根据用户需求修改单个组件属性
- **AI 正则生成**：根据描述生成正则表达式

## 技术栈

- **语言**：TypeScript
- **框架**：Express
- **数据库**：PostgreSQL（通过 Prisma ORM）
- **AI 服务**：OpenAI API
- **依赖管理**：npm

## 项目结构

```
├── src/
│   ├── config/          # 配置文件
│   │   └── openai.ts    # OpenAI API 配置
│   ├── constants/       # 常量定义
│   │   └── prompts.ts   # AI 提示词模板
│   ├── controllers/     # 控制器
│   │   ├── ai.controller.ts    # AI 相关功能
│   │   └── form.controller.ts  # 表单相关功能
│   ├── routes/          # 路由定义
│   │   ├── ai.routes.ts    # AI 路由
│   │   └── form.routes.ts  # 表单路由
│   ├── store/           # 数据存储
│   │   └── db.ts        # 数据库连接
│   └── index.ts         # 主入口文件
├── prisma/              # Prisma 相关文件
│   └── schema.prisma    # 数据库模式定义
├── package.json         # 项目配置和依赖
├── tsconfig.json        # TypeScript 配置
└── .gitignore           # Git 忽略文件
```

## 安装与运行

### 前置条件

- Node.js 16+ 环境
- PostgreSQL 数据库
- OpenAI API 密钥（或其他兼容的大模型 API）

### 安装步骤

1. **克隆项目**

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   创建 `.env` 文件，添加以下内容：
   ```env
   # 数据库连接字符串
   DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
   
   # OpenAI API 配置
   OPENAI_API_KEY="your_api_key"
   OPENAI_BASE_URL="https://api.deepseek.com/v1"  # 如果使用 DeepSeek
   ```

4. **数据库迁移**
   ```bash
   npx prisma migrate dev
   ```

5. **启动服务**
   - 开发模式：
     ```bash
     npm run dev
     ```
   - 生产模式：
     ```bash
     npm run build
     npm start
     ```

## API 文档

### 基础路径
所有 API 接口都以 `/api` 为前缀。

### AI 相关接口

#### 1. 生成表单
- **路径**：`/api/generate-form`
- **方法**：POST
- **请求体**：
  ```json
  {
    "prompt": "生成一个包含姓名、邮箱、电话的联系表单"
  }
  ```
- **响应**：SSE 流式响应，返回生成的表单配置

#### 2. 局部修改表单
- **路径**：`/api/patch-form`
- **方法**：POST
- **请求体**：
  ```json
  {
    "prompt": "添加一个验证码字段",
    "currentComponents": [/* 当前表单组件 */]
  }
  ```
- **响应**：SSE 流式响应，返回修改后的表单配置

#### 3. 修改单个组件
- **路径**：`/api/modify-component`
- **方法**：POST
- **请求体**：
  ```json
  {
    "component": { /* 组件配置 */ },
    "prompt": "将输入框改为必填"
  }
  ```
- **响应**：
  ```json
  {
    "success": true,
    "data": { /* 修改后的组件配置 */ }
  }
  ```

#### 4. 生成正则表达式
- **路径**：`/api/generate-regex`
- **方法**：POST
- **请求体**：
  ```json
  {
    "prompt": "生成一个邮箱地址的正则表达式"
  }
  ```
- **响应**：
  ```json
  {
    "success": true,
    "data": { "regex": "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$" }
  }
  ```

### 表单相关接口

#### 1. 保存表单
- **路径**：`/api/forms`
- **方法**：POST
- **请求体**：
  ```json
  {
    "title": "联系表单",
    "components": [/* 表单组件 */]
  }
  ```
- **响应**：
  ```json
  {
    "success": true,
    "data": { "formId": "form_123" }
  }
  ```

#### 2. 获取表单
- **路径**：`/api/forms/:formId`
- **方法**：GET
- **响应**：
  ```json
  {
    "success": true,
    "data": { "id": "form_123", "title": "联系表单", "components": [/* 表单组件 */] }
  }
  ```

#### 3. 提交表单
- **路径**：`/api/forms/submit`
- **方法**：POST
- **请求体**：
  ```json
  {
    "formId": "form_123",
    "content": { /* 表单数据 */ }
  }
  ```
- **响应**：
  ```json
  {
    "success": true,
    "data": { "id": "sub_123", "formId": "form_123", "content": { /* 表单数据 */ }, "createdAt": "2024-01-01T00:00:00Z" }
  }
  ```

#### 4. 获取表单提交记录
- **路径**：`/api/forms/:formId/submissions`
- **方法**：GET
- **响应**：
  ```json
  {
    "success": true,
    "data": [
      { "id": "sub_123", "formId": "form_123", "content": { /* 表单数据 */ }, "createdAt": "2024-01-01T00:00:00Z" }
    ]
  }
  ```

## 数据库模式

### Form 表
- `id`：字符串，表单ID
- `title`：字符串，表单标题
- `components`：JSON，表单组件配置
- `createdAt`：时间戳，创建时间
- `updatedAt`：时间戳，更新时间

### Submission 表
- `id`：字符串，提交记录ID
- `formId`：字符串，关联的表单ID
- `content`：JSON，提交的表单数据
- `createdAt`：时间戳，提交时间

## 开发指南

### 代码风格
- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 函数和变量命名使用驼峰命名法

### 调试技巧
- 使用 `npm run dev` 启动开发服务器，支持热重载
- 查看控制台输出的日志信息
- 使用 Prisma Studio 查看数据库内容：`npx prisma studio`

## 部署建议

- 使用 PM2 管理进程
- 配置环境变量
- 设置合适的数据库连接池
- 启用 HTTPS

## 许可证

ISC

## 联系信息

如有问题或建议，请联系项目维护者。