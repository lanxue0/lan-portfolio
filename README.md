# 交互式 3D 个人展示

> 基于 React + Three.js 的个人展示网站

## 🖼 项目简介

这是一个使用 React 和 Three.js 构建的个人展示网站，旨在通过动态视觉效果和 AI 功能展示个人技能与项目经验。网站支持响应式设计，兼容 PC 与移动端，具备丰富的交互动画与 3D 视觉效果。

## 🚀 技术栈

- **前端框架**：React + TypeScript + Vite
- **UI 组件**：Ant Design
- **3D 渲染**：Three.js
- **AI 集成**：Deepseek API
- **动画**：Canvas、CSS Animation
- **样式**：Less
- **适配**：响应式布局

## 🎯 项目功能

- **3D 地图可视化**：集成 Three.js 实现动态 3D 中国地图展示，支持从 SVG 加载数据、模型挤压生成、鼠标悬停高亮交互、动态相机聚焦特定省份及固定高亮显示当前所在地。
- **AI 自我介绍**：集成 Deepseek AI API，实现自动化生成个性化、专业化的个人介绍，通过异步请求处理加载与错误状态，提升内容独特性和吸引力。
- **动态背景**：利用 HTML5 Canvas 创建动态粒子背景，增强视觉效果。
- **响应式设计**：适配不同设备，确保在各种屏幕尺寸下都有良好的用户体验。
- **平滑导航**：实现基于 useRef 的平滑滚动导航，方便用户快速浏览不同内容区域。

## 📷 项目预览

访问 [在线演示](https://lanxue0.github.io/lan-portfolio/)

## 🛠️ 本地运行

1. 克隆仓库

```bash
git clone https://github.com/lanxue0/lan-portfolio.git
cd lan-portfolio
```

2. 安装依赖

```bash
npm install
# 或
pnpm install
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
# 或
pnpm dev
```

5. 构建生产版本

```bash
npm run build
# 或
pnpm build
```

## 📚 技术亮点

1. **3D 可视化**：使用 Three.js 实现复杂的 3D 地图交互，包括模型加载、材质处理、光照效果等。
2. **AI 集成**：通过 Deepseek API 实现智能内容生成，提升用户体验。
3. **性能优化**：使用 Vite 构建工具，实现快速的开发体验和构建性能。
4. **响应式设计**：使用 Less 和 Ant Design 实现优雅的响应式布局。
5. **代码质量**：使用 TypeScript 确保代码类型安全，提高可维护性。

## 👨‍💻 作者

- 邮箱：1259700509@qq.com
- GitHub：[lanxue0](https://github.com/lanxue0)

---
