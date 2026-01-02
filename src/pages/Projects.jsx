import { useState, useEffect } from 'react';
import { Plus, Search, MoreHorizontal, Edit, Trash2, Users, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Select } from '@headlessui/react';
import ProjectForm from '../components/ProjectForm';
import { api } from '../utils/api';

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all'); // 添加筛选状态
    const { t } = useTranslation();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // 直接请求后端API获取项目列表
                const data = await api.get('/projects');
                // 检查后端返回的数据格式，可能是直接的数组或包装在data属性中
                const projectsData = Array.isArray(data) ? data : (data.data || []);
                // 转换后端返回的数据格式，添加前端需要的字段
                const formattedProjects = projectsData.map(project => ({
                    ...project,
                    status: project.status || 'planning',
                    deadline: project.deadline || new Date().toISOString().split('T')[0],
                    members: project.members || 0,
                    progress: project.progress || 0
                }));
                setProjects(formattedProjects);
            } catch (error) {
                console.error('Failed to fetch projects:', error);
                // API请求失败时显示空列表
                setProjects([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const handleCreateProject = async (projectData) => {
        try {
            // 调用后端API创建项目，不再传递owner_id字段
            const newProject = await api.post('/projects', projectData);
            // 转换后端返回的数据格式，添加前端需要的字段
            const formattedProject = {
                ...newProject.data,
                status: newProject.data.status || 'planning',
                deadline: newProject.data.deadline || new Date().toISOString().split('T')[0],
                members: newProject.data.members || 0,
                progress: newProject.data.progress || 0
            };
            setProjects(prev => [...prev, formattedProject]);
        } catch (error) {
            console.error('Failed to create project:', error);
            // 发生错误时使用本地模拟数据
            const mockNewProject = {
                id: projects.length + 1,
                ...projectData,
                members: 0,
                progress: 0
            };
            setProjects(prev => [...prev, mockNewProject]);
        }
    };

    const handleUpdateProject = async (projectData) => {
        try {
            // 调用后端API更新项目，不再传递owner_id字段
            const updatedProject = await api.post(`/projects/${projectData.id}`, projectData);
            // 转换后端返回的数据格式
            const formattedProject = {
                ...updatedProject.data,
                status: updatedProject.data.status || 'planning',
                deadline: updatedProject.data.deadline || new Date().toISOString().split('T')[0],
                members: updatedProject.data.members || 0,
                progress: updatedProject.data.progress || 0
            };
            setProjects(prev => prev.map(project => 
                project.id === projectData.id ? formattedProject : project
            ));
        } catch (error) {
            console.error('Failed to update project:', error);
            // 发生错误时使用本地更新
            setProjects(prev => prev.map(project => 
                project.id === projectData.id ? projectData : project
            ));
        }
    };

    const handleDeleteProject = async (projectId) => {
        try {
            // 调用后端API删除项目
            await api.post(`/projects/${projectId}/delete`);
            // 更新本地状态
            setProjects(prev => prev.filter(project => project.id !== projectId));
        } catch (error) {
            console.error('Failed to delete project:', error);
            // 发生错误时使用本地删除
            setProjects(prev => prev.filter(project => project.id !== projectId));
        }
    };

    const openCreateForm = () => {
        setEditingProject(null);
        setIsFormOpen(true);
    };

    const openEditForm = (project) => {
        setEditingProject(project);
        setIsFormOpen(true);
    };

    const handleSubmit = (projectData) => {
        if (projectData.id) {
            handleUpdateProject(projectData);
        } else {
            handleCreateProject(projectData);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-white text-xl font-bold animate-pulse">Loading Projects...</div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <header className="max-w-[1600px] w-full mx-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">{t('projects.title')}</h1>
                        <p className="text-slate-400 font-medium">{t('projects.subtitle')}</p>
                    </div>
                    <button className="btn-primary" onClick={openCreateForm}>
                        <Plus className="w-4 h-4" />
                        <span>{t('projects.newProject')}</span>
                    </button>
                </div>
            </header>

            {/* 固定宽度的容器，确保在所有状态下都一致 */}
            <div className="w-full max-w-[1600px] mx-auto">
                <div className="glass-card p-6 rounded-3xl">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex-1 max-w-md">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-primary-400 transition-colors" />
                                <input
                                    type="text"
                                    placeholder={t('projects.search')}
                                    className="input-search"
                                />
                            </div>
                        </div>
                        <div className="relative ml-4">
                            <Select
                                value={filterStatus}
                                onChange={(value) => setFilterStatus(value)}
                                className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2 pr-10 text-sm text-slate-300 outline-none cursor-pointer hover:bg-white/10 transition-colors"
                            >
                                <option value="all">{t('projects.allProjects')}</option>
                                <option value="active">{t('projects.status.active')}</option>
                                <option value="planning">{t('projects.status.planning')}</option>
                                <option value="completed">{t('projects.status.completed')}</option>
                            </Select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="projects-table">
                            <thead>
                                <tr>
                                    <th>{t('projects.table.project')}</th>
                                    <th>{t('projects.table.members')}</th>
                                    <th>{t('projects.table.status')}</th>
                                    <th>{t('projects.table.deadline')}</th>
                                    <th>{t('projects.table.progress')}</th>
                                    <th>{t('projects.table.actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* 根据筛选状态过滤项目 */}
                                {(() => {
                                    const filteredProjects = projects.filter(project => {
                                        if (filterStatus === 'all') return true;
                                        return project.status === filterStatus;
                                    });
                                    
                                    if (filteredProjects.length === 0) {
                                        // 空状态处理
                                        return (
                                            <tr>
                                                <td colSpan="6" className="py-20 text-center">
                                                    <div className="flex flex-col items-center justify-center text-slate-400">
                                                        <Users className="w-12 h-12 mb-4 opacity-50" />
                                                        <h3 className="text-lg font-semibold mb-2">{t('projects.noProjects.title')}</h3>
                                                        <p className="text-sm mb-6">{t('projects.noProjects.subtitle')}</p>
                                                        <button 
                                                            className="btn-primary" 
                                                            onClick={openCreateForm}
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                            <span>{t('projects.newProject')}</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }
                                    
                                    // 有项目时的渲染
                                    return filteredProjects.map((project) => (
                                        <motion.tr
                                            key={project.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <td>
                                                <div className="project-info">
                                                    <div className="project-avatar">
                                                        <Users className="w-6 h-6" />
                                                    </div>
                                                    <div className="project-details">
                                                        <h3 className="project-name">{project.name}</h3>
                                                        <p className="project-description">{project.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="project-meta-item">
                                                    <Users className="w-4 h-4" />
                                                    <span>{project.members}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`status-badge status-${project.status}`}>
                                                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="deadline">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{project.deadline}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="progress-container">
                                                    <div className="progress-bar">
                                                        <div 
                                                            className="progress-fill"
                                                            style={{ width: `${project.progress}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="progress-text">{project.progress}%</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="actions">
                                                    <button 
                                                        className="action-btn"
                                                        onClick={() => openEditForm(project)}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        className="action-btn"
                                                        onClick={() => handleDeleteProject(project.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                    <button className="action-btn">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ));
                                })()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Project Form Modal */}
            <ProjectForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingProject}
            />
        </div>
    );
}