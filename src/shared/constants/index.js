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

// 项目优先级
export const PROJECT_PRIORITY = {
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
};

// 优先级选项
export const PROJECT_PRIORITY_OPTIONS = [
  { value: PROJECT_PRIORITY.HIGH, label: '高', color: '#EF4444' },
  { value: PROJECT_PRIORITY.MEDIUM, label: '中', color: '#F59E0B' },
  { value: PROJECT_PRIORITY.LOW, label: '低', color: '#10B981' },
];

// 排序选项
export const PROJECT_SORT_OPTIONS = [
  { value: 'createdAt', label: '创建时间' },
  { value: 'updatedAt', label: '更新时间' },
  { value: 'name', label: '名称' },
  { value: 'progress', label: '进度' },
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

