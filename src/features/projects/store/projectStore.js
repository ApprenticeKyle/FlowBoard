import { create } from 'zustand';
import { apiClient } from '@shared/utils/apiClient';
import { PROJECT_STATUS } from '@shared/constants';

// 项目状态管理store
export const useProjectStore = create((set, get) => ({
  // 状态
  projects: [],
  loading: false,
  error: null,
  isFormOpen: false,
  editingProject: null,
  filterStatus: 'all',
  searchQuery: '',

  // 加载项目列表
  fetchProjects: async (status = 'all') => {
    try {
      set({ loading: true, error: null });
      const statusValue = typeof status === 'object' ? (status?.value || 'all') : status;
      const params = statusValue !== 'all' ? { status: statusValue } : {};
      const data = await apiClient.get('/projects', params);
      const projectsData = Array.isArray(data) ? data : [];
      const formattedProjects = projectsData.map(project => ({
        ...project,
        status: project.status || PROJECT_STATUS.PLANNING,
        deadline: project.deadline || new Date().toISOString().split('T')[0],
        members: project.members || 0,
        progress: project.progress || 0
      }));
      set({ projects: formattedProjects, filterStatus: statusValue });
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      set({ error: error.message, projects: [] });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // 创建项目
  createProject: async (projectData) => {
    try {
      set({ loading: true, error: null });
      const newProject = await apiClient.post('/projects', projectData);
      const formattedProject = {
        ...newProject,
        status: newProject.status || PROJECT_STATUS.PLANNING,
        deadline: newProject.deadline || new Date().toISOString().split('T')[0],
        members: newProject.members || 0,
        progress: newProject.progress || 0
      };
      set(state => ({ projects: [...state.projects, formattedProject] }));
      return formattedProject;
    } catch (error) {
      console.error('Failed to create project:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // 更新项目
  updateProject: async (projectData) => {
    try {
      set({ loading: true, error: null });
      const updatedProject = await apiClient.put(`/projects/${projectData.id}`, projectData);
      const formattedProject = {
        ...updatedProject,
        status: updatedProject.status || PROJECT_STATUS.PLANNING,
        deadline: updatedProject.deadline || new Date().toISOString().split('T')[0],
        members: updatedProject.members || 0,
        progress: updatedProject.progress || 0
      };
      set(state => ({
        projects: state.projects.map(project => 
          project.id === projectData.id ? formattedProject : project
        )
      }));
      return formattedProject;
    } catch (error) {
      console.error('Failed to update project:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // 删除项目
  deleteProject: async (projectId) => {
    try {
      set({ loading: true, error: null });
      await apiClient.delete(`/projects/${projectId}`);
      set(state => ({
        projects: state.projects.filter(project => project.id !== projectId)
      }));
    } catch (error) {
      console.error('Failed to delete project:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
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
    set({ isFormOpen: false, editingProject: null });
  },

  // 提交表单
  submitForm: async (projectData) => {
    if (projectData.id) {
      return await get().updateProject(projectData);
    } else {
      return await get().createProject(projectData);
    }
  },

  // 设置筛选状态
  setFilterStatus: (status) => {
    set({ filterStatus: status });
  },

  // 设置搜索关键词
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  // 清除错误
  clearError: () => {
    set({ error: null });
  },
}));

