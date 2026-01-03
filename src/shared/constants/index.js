// API相关常量
export const API_BASE_URL = '/api';

// 项目状态
export const PROJECT_STATUS = {
  PLANNING: 'planning',
  ACTIVE: 'active',
  COMPLETED: 'completed',
};

// 任务状态
export const TASK_STATUS = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  REVIEW: 'REVIEW',
  DONE: 'DONE',
};

// 任务优先级
export const TASK_PRIORITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
};

// 状态选项（用于Select组件）
export const PROJECT_STATUS_OPTIONS = [
  { value: 'all', label: '所有项目' },
  { value: PROJECT_STATUS.PLANNING, label: '规划中' },
  { value: PROJECT_STATUS.ACTIVE, label: '进行中' },
  { value: PROJECT_STATUS.COMPLETED, label: '已完成' },
];

// 路由路径
export const ROUTES = {
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  BOARD: '/board',
  CHAT: '/chat',
  TEAM: '/team',
  TASK_DETAIL: '/tasks/:id',
};

// 本地存储键
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
};

