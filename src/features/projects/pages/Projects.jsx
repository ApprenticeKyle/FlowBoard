import { useEffect, useState, useMemo } from 'react';
import { Plus, Search, MoreHorizontal, Edit, Trash2, Users, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Input, Select, Button, Card } from '@shared/ui';
import { PageContainer } from '@shared/components';
import { useProjectStore } from '../store/projectStore';
import ProjectForm from '../components/ProjectForm';
import { useToastStore } from '@shared/store/toastStore';
import { useConfirmStore } from '@shared/store/confirmStore';
import { PROJECT_STATUS_OPTIONS } from '@shared/constants';

export default function Projects() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const {
    projects,
    loading,
    isFormOpen,
    editingProject,
    filterStatus,
    searchQuery,
    fetchProjects,
    openCreateForm,
    openEditForm,
    submitForm,
    closeForm,
    setFilterStatus,
    setSearchQuery,
  } = useProjectStore();

  const { showSuccess, showError } = useToastStore();
  const { openConfirm } = useConfirmStore();
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || '');

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // 客户端筛选，不触发API请求
  const handleFilterChange = (value) => {
    setFilterStatus(value);
    // 不再调用 fetchProjects，只使用客户端筛选
  };

  // 处理搜索输入
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    setSearchQuery(value);
  };

  // 筛选和搜索项目
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // 状态筛选
      const statusMatch = filterStatus === 'all' || project.status === filterStatus;
      
      // 搜索筛选
      const searchMatch = !searchQuery || 
        project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return statusMatch && searchMatch;
    });
  }, [projects, filterStatus, searchQuery]);

  const handleSubmit = async (projectData) => {
    try {
      await submitForm(projectData);
      showSuccess(t('projects.createSuccess'));
      fetchProjects();
    } catch (error) {
      showError(t('projects.createError'));
    }
  };

  const handleDelete = async (projectId) => {
    try {
      await useProjectStore.getState().deleteProject(projectId);
      showSuccess(t('projects.deleteSuccess'));
      fetchProjects();
    } catch (error) {
      showError(t('projects.deleteError'));
    }
  };

  const handleDeleteClick = (projectId) => {
    openConfirm({
      title: t('projects.deleteConfirmTitle'),
      message: t('projects.deleteConfirmMessage'),
      onConfirm: () => handleDelete(projectId),
    });
  };


  return (
    <PageContainer>
      <div className="space-y-8 w-full">
        <header className="w-full">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{t('projects.title')}</h1>
              <p className="text-slate-400 font-medium">{t('projects.subtitle')}</p>
            </div>
            <Button icon={Plus} onClick={openCreateForm}>
              {t('projects.newProject')}
            </Button>
          </div>
        </header>

        <div className="w-full">
          <Card className="w-full">
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1 max-w-md">
              <Input
                type="search"
                placeholder={t('projects.search')}
                value={localSearchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <div className="relative ml-4">
              <Select
                value={filterStatus}
                onChange={handleFilterChange}
                options={PROJECT_STATUS_OPTIONS}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-white text-xl font-bold animate-pulse">{t('common.loading')}</div>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="projects-table w-full">
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
                  {filteredProjects.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-20 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <Users className="w-12 h-12 mb-4 opacity-50" />
                          <h3 className="text-lg font-semibold mb-2">{t('projects.noProjects.title')}</h3>
                          <p className="text-sm mb-6">{t('projects.noProjects.subtitle')}</p>
                          <Button icon={Plus} onClick={openCreateForm}>
                            {t('projects.newProject')}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredProjects.map((project) => (
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
                              <h3 
                                className="project-name cursor-pointer hover:text-primary-400 transition-colors"
                                onClick={() => handleProjectClick(project.id)}
                              >
                                {project.name}
                              </h3>
                              <p 
                                className="project-description cursor-pointer hover:text-slate-300 transition-colors"
                                onClick={() => handleProjectClick(project.id)}
                                title={project.description}
                              >
                                {project.description || t('projects.noDescription')}
                              </p>
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
                              onClick={() => handleDeleteClick(project.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button className="action-btn">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          </Card>
        </div>

        <ProjectForm
          isOpen={isFormOpen}
          onClose={closeForm}
          onSubmit={handleSubmit}
          initialData={editingProject}
        />
      </div>
    </PageContainer>
  );
}

