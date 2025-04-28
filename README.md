# 📌 项目标题

> 基于 React + WebGL 的个人展示网站

---

## 🖼 项目简介

这是一个使用 React 构建的个人展示网站，结合 Three.js 和 Canvas 动态背景，展示个人信息、技能、经历等内容。网站支持响应式设计，兼容 PC 与移动端，具备丰富的交互动画与 3D 视觉效果。

---

## 🚀 技术栈

- **前端框架**：React + Vite
- **3D 渲染**：Three.js
- **动画**：Canvas、CSS Animation
- **适配**：响应式布局

---

## 🎯 项目功能

---

## 📷 项目预览

---

## 🛠️ 本地运行

```bash

```

---

## 📝 项目总结

---

# 个人作品集网站

这是一个现代化的个人作品集网站，使用 React、TypeScript 和 Three.js 构建，具有 3D 交互效果和 AI 自我介绍功能。

## 功能特点

- 响应式设计，适配不同设备
- Three.js 3D 模型展示
- 动态粒子背景
- AI 生成的自我介绍（由 Deepseek API 提供支持）
- 现代化的 UI 界面

## 技术栈

- React
- TypeScript
- Ant Design
- Three.js
- Deepseek API

## 安装和运行

1. 克隆仓库

```bash
git clone <repo-url>
cd lan-portfolio
```

2. 安装依赖

```bash
npm install
```

3. 配置 Deepseek API

在项目根目录创建`.env`文件，添加你的 Deepseek API 密钥：

```
VITE_DEEPSEEK_API_KEY=your-deepseek-api-key-here
```

> 注意：请保护好你的 API 密钥，不要将其提交到公共仓库中。

4. 启动开发服务器

```bash
npm run dev
```

## AI 自我介绍功能

项目中集成了 Deepseek API，用于生成个性化的 AI 自我介绍。该功能允许：

- 展示 AI 生成的专业自我介绍
- 基于预设的系统提示词生成内容
- 刷新获取新的介绍内容

### 自定义初始介绍

你可以在`PortfolioPage.tsx`中修改传递给`AiIntroduction`组件的`initialMessage`属性来自定义初始显示的内容：

```jsx
<AiIntroduction
  initialMessage="在这里添加你的自定义初始介绍..."
  language="zh"
  apiKey={deepseekApiKey}
/>
```

## 注意事项

- 此项目需要有效的 Deepseek API 密钥才能使用 AI 自我介绍功能
- API 调用会消耗你的 Deepseek 账户额度
- 如果不设置 API 密钥，AI 自我介绍组件会显示错误信息

## 许可

MIT

---
