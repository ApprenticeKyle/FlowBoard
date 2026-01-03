import { create } from 'zustand';
import { api } from '../utils/api';
import { useTranslation } from 'react-i18next';

// 创建项目状态管理store
export const useProjectStore = create((set, get) => ({
  // 状态
  projects: [],
  loading: true,
  isFormOpen: false,
  editingProject: null,
  filterStatus: 'all',
  toastVisible: false,
  toastMessage: '',
  toastType: 'success',
  confirmDialogOpen: false,
  projectToDelete: null,

  // 加载项目列表
  fetchProjects: async (status = 'all') => {
    try {
      set({ loading: true });
      // 确保status是字符串类型
      const statusValue = typeof status === 'object' ? (status?.value || 'all') : status;
      const params = statusValue !== 'all' ? { status: statusValue } : {};
      const data = await api.get('/projects', params);
      const projectsData = Array.isArray(data) ? data : [];
      const formattedProjects = projectsData.map(project => ({
        ...project,
        status: project.status || 'planning',
        deadline: project.deadline || new Date().toISOString().split('T')[0],
        members: project.members || 0,
        progress: project.progress || 0
      }));
      set({ projects: formattedProjects, filterStatus: statusValue });
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      set({ projects: [] });
    } finally {
      set({ loading: false });
    }
  },

  // 创建项目
  createProject: async (projectData) => {
    try {
      const newProject = await api.post('/projects', projectData);
      const formattedProject = {
        ...newProject,
        status: newProject.status || 'planning',
        deadline: newProject.deadline || new Date().toISOString().split('T')[0],
        members: newProject.members || 0,
        progress: newProject.progress || 0
      };
      set(state => ({ projects: [...state.projects, formattedProject] }));
      get().showToast('projects.createSuccess', 'success');
    } catch (error) {
      console.error('Failed to create project:', error);
      get().showToast('projects.createError', 'error');
    }
  },

  // 更新项目
  updateProject: async (projectData) => {
    try {
      const updatedProject = await api.put(`/projects/${projectData.id}`, projectData);
      const formattedProject = {
        ...updatedProject,
        status: updatedProject.status || 'planning',
        deadline: updatedProject.deadline || new Date().toISOString().split('T')[0],
        members: updatedProject.members || 0,
        progress: updatedProject.progress || 0
      };
      set(state => ({
        projects: state.projects.map(project => 
          project.id === projectData.id ? formattedProject : project
        )
      }));
      get().showToast('projects.updateSuccess', 'success');
    } catch (error) {
      console.error('Failed to update project:', error);
      set(state => ({
        projects: state.projects.map(project => 
          project.id === projectData.id ? projectData : project
        )
      }));
      get().showToast('projects.updateError', 'error');
    }
  },

  // 删除项目
  deleteProject: async (projectId) => {
    try {
      await api.delete(`/projects/${projectId}`);
      set(state => ({
        projects: state.projects.filter(project => project.id !== projectId)
      }));
      get().showToast('projects.deleteSuccess', 'success');
    } catch (error) {
      console.error('Failed to delete project:', error);
      set(state => ({
        projects: state.projects.filter(project => project.id !== projectId)
      }));
      get().showToast('projects.deleteError', 'error');
    }
  },

  // 打开创建表单
  openCreateForm: () => {
    set({ editingProject: null, isFormOpen: true });
  },

  // 打开编辑表单
  openEditForm: (project) => {
    set({ editingProject: project, isFormOpen: true });
  },

  // 关闭表单
  closeForm: () => {
    set({ isFormOpen: false });
  },

  // 提交表单
  submitForm: (projectData) => {
    if (projectData.id) {
      get().updateProject(projectData);
    } else {
      get().createProject(projectData);
    }
    get().closeForm();
  },

  // Toast 控制函数
  showToast: (message, type = 'success', duration = 3000) => {
    set({ toastMessage: message, toastType: type, toastVisible: true });
    // 自动关闭
    setTimeout(() => {
      set({ toastVisible: false });
    }, duration);
  },

  // 关闭 Toast
  closeToast: () => {
    set({ toastVisible: false });
  },

  // 打开删除确认对话框
  openDeleteConfirm: (projectId) => {
    set({ projectToDelete: projectId, confirmDialogOpen: true });
  },

  // 关闭删除确认对话框
  closeDeleteConfirm: () => {
    set({ confirmDialogOpen: false, projectToDelete: null });
  },

  // 确认删除
  confirmDelete: async () => {
    const { projectToDelete } = get();
    if (projectToDelete) {
      await get().deleteProject(projectToDelete);
      get().closeDeleteConfirm();
    }
  },

  // 设置筛选状态
  setFilterStatus: (status) => {
    set({ filterStatus: status });
  }
}));
