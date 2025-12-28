# FlowBoard ⚡️

[English](./README.md) | [简体中文](./README.zh-CN.md)

**FlowBoard** is a high-performance, visually stunning Kanban interface designed for modern task management. Built with the latest web technologies, it features a glassmorphic UI, fluid animations, and a focus on developer experience.

It serves as the primary frontend for the **[FlowStack](https://github.com/your-repo/FlowStack)** microservices ecosystem.

---

## ✨ Features

- 🧊 **Glassmorphism Design**: Premium UI with translucent layers and backdrop blurs.
- 🚀 **Vite 7 Powered**: Lightning-fast Hot Module Replacement (HMR) and optimized builds.
- 🎨 **Tailwind CSS v4**: Utilizing the next-generation CSS framework for utility-first styling.
- 🎭 **Framer Motion**: Smooth orchestrated animations and page transitions.
- 📱 **Fully Responsive**: Optimized for desktops, tablets, and mobile devices.
- 🏗️ **Clean Architecture**: Decoupled components and predictable state management.

## 🛠️ Tech Stack

- **Core**: React 19
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4 (Vite First approach)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Utilities**: clsx, tailwind-merge

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/FlowBoard.git
    cd FlowBoard
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run in development mode**:
    ```bash
    npm run dev
    ```

4.  **Build for production**:
    ```bash
    npm run build
    ```

## 📂 Project Structure

```text
FlowBoard/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Full page layouts (Dashboard, Kanban)
│   ├── layouts/        # Layout wrappers (Sidebar, Topbar)
│   ├── hooks/          # Custom React hooks
│   └── index.css       # Global styles & Tailwind entry
├── public/             # Static assets
└── vite.config.js      # Vite & Tailwind configuration
```

## 🤝 Ecosystem

FlowBoard is designed to work seamlessly with:
- **[FlowStack](https://github.com/your-repo/FlowStack)**: The backend microservices engine.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
