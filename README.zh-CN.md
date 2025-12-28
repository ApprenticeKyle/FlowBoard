# FlowBoard ⚡️

[English](./README.md) | [简体中文](./README.zh-CN.md)

**FlowBoard** 是一个高性能、视觉惊艳的看板界面，专为现代任务管理而设计。它采用最新的 Web 技术构建，具有玻璃拟态（Glassmorphism） UI、流体动画，并专注于开发者体验。

它是 **[FlowStack](https://github.com/your-repo/FlowStack)** 微服务生态系统的主要前端界面。

---

## ✨ 特性

- 🧊 **玻璃拟态设计**: 具有半透明层和背景模糊效果的更高级 UI。
- 🚀 **Vite 7 驱动**: 闪电般的模块热替换 (HMR) 和优化的构建速度。
- 🎨 **Tailwind CSS v4**: 利用下一代 CSS 框架进行实用优先的样式设计。
- 🎭 **Framer Motion**: 平滑的编排动画和页面切换。
- 📱 **全响应式**: 针对桌面、平板电脑和移动设备进行了优化。
- 🏗️ **简洁架构**: 组件解耦和可预测的状态管理。

## 🛠️ 技术栈

- **核心**: React 19
- **构建工具**: Vite 7
- **样式**: Tailwind CSS v4 (Vite First 模式)
- **图标**: Lucide React
- **动画**: Framer Motion
- **工具库**: clsx, tailwind-merge

## 🚀 快速开始

### 前置条件

- [Node.js](https://nodejs.org/) (v18 或更高版本)
- [npm](https://www.npmjs.com/) 或 [yarn](https://yarnpkg.com/)

### 安装步骤

1.  **克隆仓库**:
    ```bash
    git clone https://github.com/your-username/FlowBoard.git
    cd FlowBoard
    ```

2.  **安装依赖**:
    ```bash
    npm install
    ```

3.  **启动开发模式**:
    ```bash
    npm run dev
    ```

4.  **生产环境构建**:
    ```bash
    npm run build
    ```

## 📂 项目结构

```text
FlowBoard/
├── src/
│   ├── components/     # 可复用的 UI 组件
│   ├── pages/          # 完整页面布局 (控制面板、看板)
│   ├── layouts/        # 布局包装器 (侧边栏、顶栏)
│   ├── hooks/          # 自定义 React hooks
│   └── index.css       # 全局样式和 Tailwind 入口
├── public/             # 静态资源
└── vite.config.js      # Vite 和 Tailwind 配置
```

## 🤝 生态系统

FlowBoard 旨在与以下项目无缝协作：
- **[FlowStack](https://github.com/your-repo/FlowStack)**: 后端微服务引擎。

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。
