# FlowBoard 项目架构说明

## 📁 目录结构

```
src/
├── shared/              # 共享资源
│   ├── components/      # 全局共享组件
│   │   ├── GlobalToast.jsx
│   │   └── GlobalConfirmDialog.jsx
│   ├── ui/              # UI组件库
│   │   ├── button/
│   │   ├── input/
│   │   ├── select/
│   │   ├── card/
│   │   ├── modal/
│   │   ├── dialog/
│   │   └── toast/
│   ├── hooks/           # 自定义Hooks
│   │   ├── useApi.js
│   │   └── useToast.js
│   ├── store/           # 全局状态管理
│   │   ├── toastStore.js
│   │   └── confirmStore.js
│   ├── utils/           # 工具函数
│   │   └── apiClient.js
│   ├── constants/       # 常量定义
│   │   └── index.js
│   └── types/           # 类型定义（如需要）
│
├── features/            # 功能模块（按业务划分）
│   ├── projects/        # 项目管理模块
│   │   ├── components/  # 模块内组件
│   │   ├── pages/       # 模块页面
│   │   └── store/       # 模块状态管理
│   ├── tasks/           # 任务管理模块
│   ├── dashboard/       # 仪表盘模块
│   ├── team/            # 团队模块
│   └── chat/            # 聊天模块
│
├── components/          # 旧组件（逐步迁移）
├── pages/               # 旧页面（逐步迁移）
├── layouts/             # 布局组件
├── store/               # 旧状态管理（逐步迁移）
├── utils/               # 旧工具（向后兼容）
└── hooks/               # 旧Hooks（逐步迁移）
```

## 🎯 架构原则

### 1. 功能模块化（Feature-based）
- 每个功能模块独立管理自己的组件、页面和状态
- 模块间通过共享层（shared）进行通信
- 便于代码复用和维护

### 2. 共享资源集中管理
- UI组件库统一在 `shared/ui` 中
- 全局状态管理在 `shared/store` 中
- 工具函数和常量在 `shared/utils` 和 `shared/constants` 中

### 3. 路径别名
使用路径别名简化导入路径：
- `@shared/*` → `src/shared/*`
- `@features/*` → `src/features/*`
- `@components/*` → `src/components/*`
- `@pages/*` → `src/pages/*`
- `@store/*` → `src/store/*`
- `@utils/*` → `src/utils/*`
- `@hooks/*` → `src/hooks/*`

## 🧩 UI组件系统

### 基础组件
- **Button**: 按钮组件，支持多种变体和状态
- **Input**: 输入框组件，支持图标和错误状态
- **Select**: 下拉选择组件，基于Headless UI
- **Card**: 卡片组件，支持多种变体
- **Modal**: 模态框组件
- **ConfirmDialog**: 确认对话框
- **Toast**: 消息提示组件

### 使用示例
```jsx
import { Button, Input, Select, Card } from '@shared/ui';

function MyComponent() {
  return (
    <Card>
      <Input placeholder="输入内容" />
      <Select options={options} value={value} onChange={setValue} />
      <Button variant="primary" icon={Plus}>提交</Button>
    </Card>
  );
}
```

## 📦 状态管理

### Zustand Store结构
- **模块Store**: 每个功能模块有自己的store（如 `features/projects/store/projectStore.js`）
- **全局Store**: 共享状态在 `shared/store` 中（如 `toastStore.js`, `confirmStore.js`）

### 使用示例
```jsx
import { useProjectStore } from '@features/projects/store/projectStore';
import { useToastStore } from '@shared/store/toastStore';

function ProjectsPage() {
  const { projects, fetchProjects } = useProjectStore();
  const { showSuccess } = useToastStore();
  
  // ...
}
```

## 🔌 API层

### API客户端
- 统一的错误处理
- 自动token管理
- 请求/响应拦截

### 使用示例
```jsx
import { apiClient } from '@shared/utils/apiClient';

// GET请求
const projects = await apiClient.get('/projects', { status: 'active' });

// POST请求
const newProject = await apiClient.post('/projects', projectData);

// PUT请求
const updated = await apiClient.put(`/projects/${id}`, data);

// DELETE请求
await apiClient.delete(`/projects/${id}`);
```

## 🎣 自定义Hooks

### useApi
用于处理API请求的loading和error状态：
```jsx
import { useApi } from '@shared/hooks';

function MyComponent() {
  const { loading, error, request } = useApi();
  
  const handleSubmit = async () => {
    await request(
      () => apiClient.post('/projects', data),
      (result) => console.log('Success:', result),
      (err) => console.error('Error:', err)
    );
  };
}
```

### useToast
用于显示消息提示：
```jsx
import { useToast } from '@shared/hooks';

function MyComponent() {
  const { showSuccess, showError } = useToast();
  
  const handleAction = () => {
    showSuccess('操作成功');
  };
}
```

## 🚀 迁移指南

### 从旧架构迁移到新架构

1. **组件迁移**
   - 将业务组件移到对应的 `features/*/components/`
   - 将共享组件移到 `shared/components/` 或 `shared/ui/`

2. **状态管理迁移**
   - 将模块相关的store移到 `features/*/store/`
   - 将全局共享的store移到 `shared/store/`

3. **更新导入路径**
   - 使用路径别名替代相对路径
   - 从 `shared/ui` 导入UI组件

4. **使用新的UI组件**
   - 替换自定义的Button、Input等为统一的UI组件
   - 使用全局Toast和ConfirmDialog

## 📝 开发规范

1. **命名规范**
   - 组件使用PascalCase
   - 文件使用PascalCase（组件）或camelCase（工具函数）
   - Store使用camelCase

2. **导入顺序**
   ```jsx
   // 1. React相关
   import { useState } from 'react';
   
   // 2. 第三方库
   import { useTranslation } from 'react-i18next';
   
   // 3. 共享资源（使用路径别名）
   import { Button } from '@shared/ui';
   import { useToastStore } from '@shared/store/toastStore';
   
   // 4. 功能模块
   import { useProjectStore } from '@features/projects/store/projectStore';
   
   // 5. 相对路径
   import './styles.css';
   ```

3. **组件结构**
   - 优先使用函数组件和Hooks
   - 保持组件单一职责
   - 提取可复用的逻辑到自定义Hooks

## 🔧 配置说明

### Vite配置
- 路径别名在 `vite.config.js` 中配置
- 代理配置在 `server.proxy` 中

### ESLint配置
- 已配置React Hooks规则
- 支持JSX语法

## 📚 下一步计划

- [ ] 迁移剩余页面到新架构
- [ ] 添加TypeScript支持（可选）
- [ ] 完善单元测试
- [ ] 添加Storybook文档
- [ ] 性能优化和代码分割

