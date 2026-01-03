import { useEffect } from 'react';
import { Plus, Search, MoreHorizontal, Edit, Trash2, Users, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ProjectForm from '../components/ProjectForm';
import Toast from '../components/Toast';
import ConfirmDialog from '../components/ConfirmDialog';
import { useProjectStore } from '../store/projectStore';

export default function Projects() {
    const { t } = useTranslation();
    
    // 从store获取状态和方法
    const {
        projects,
        loading,
        isFormOpen,
        editingProject,
        filterStatus,
        toastVisible,
        toastMessage,
        toastType,
        confirmDialogOpen,
        fetchProjects,
        openCreateForm,
        openEditForm,
        submitForm,
        closeToast,
        openDeleteConfirm,
        closeDeleteConfirm,
        confirmDelete,
        setFilterStatus
    } = useProjectStore();

    // 组件挂载时加载项目数据
    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);
    

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
                            <select
                                value={filterStatus}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFilterStatus(value);
                                    fetchProjects(value);
                                }}
                                className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2 pr-10 text-sm text-slate-300 outline-none cursor-pointer hover:bg-white/10 transition-colors"
                            >
                                <option value="all">{t('projects.allProjects')}</option>
                                <option value="active">{t('projects.status.active')}</option>
                                <option value="planning">{t('projects.status.planning')}</option>
                                <option value="completed">{t('projects.status.completed')}</option>
                            </select>
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
                                                        onClick={() => openDeleteConfirm(project.id)}
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
                onClose={() => useProjectStore.getState().closeForm()}
                onSubmit={submitForm}
                initialData={editingProject}
            />

            {/* Toast Component */}
            <Toast
                isVisible={toastVisible}
                message={toastMessage}
                type={toastType}
                onClose={closeToast}
            />

            {/* Confirm Dialog Component */}
            <ConfirmDialog
                isOpen={confirmDialogOpen}
                title={t('projects.deleteConfirmTitle')}
                message={t('projects.deleteConfirmMessage')}
                onConfirm={confirmDelete}
                onCancel={closeDeleteConfirm}
            />
        </div>
    );
}