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

## 📚 技术实现思路

### 3D 地图实现

1. **数据源选择**

   - 最初计划使用 Three.js 的几何体手动构建地图模型
   - 后来发现可以使用 SVG 作为数据源，大大简化了实现
   - 选择使用中国地图的 SVG 文件，包含各省份的路径数据

2. **模型生成**

   - 使用 Three.js 的 `SVGLoader` 加载 SVG 文件
   - 通过 `ExtrudeGeometry` 将 2D 路径挤压成 3D 模型
   - 为每个省份创建独立的网格和边框

3. **交互实现**

   - 使用 `Raycaster` 实现鼠标悬停检测
   - 当鼠标悬停在省份上时，改变其材质实现高亮效果
   - 添加 Tooltip 显示省份名称
   - 实现固定高亮功能，使特定省份（如当前所在地）保持高亮状态

4. **相机控制**

   - 使用 `OrbitControls` 实现相机控制
   - 计算目标省份的边界框，自动调整相机位置
   - 通过调整整个 SVG 组的位置，确保目标省份在画布中心
   - 限制相机移动范围，防止模型移出视野

5. **性能优化**

   - 使用 `useRef` 管理 Three.js 实例
   - 在组件卸载时正确清理资源
   - 使用 `requestAnimationFrame` 实现平滑动画

### 动态背景实现

1. **粒子点的生成**

   - 创建粒子类，包含位置、速度、大小等属性
   - 使用数组管理多个粒子实例
   - 通过 `Math.random()` 生成随机初始位置和速度

2. **动画实现**

   - 使用 `requestAnimationFrame` 实现动画循环
   - 在每一帧更新粒子位置
   - 实现粒子之间的连线效果
   - 添加边界检测，使粒子在画布范围内移动

3. **交互实现**

   - 监听鼠标移动事件
   - 根据鼠标位置调整粒子运动
   - 实现粒子与鼠标的互动效果
   - 添加粒子颜色渐变效果

## 👨‍💻 作者

- 邮箱：1259700509@qq.com
- GitHub：[lanxue0](https://github.com/lanxue0)

---
