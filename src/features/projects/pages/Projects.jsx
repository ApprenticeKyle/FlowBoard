import { useEffect, useState, useMemo } from 'react';
import { Plus, Search, MoreHorizontal, Edit, Trash2, Users, Calendar, Star, Archive, Copy, Filter, ArrowUpDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Input, Select, Button, Card } from '@shared/ui';
import { PageContainer } from '@shared/components';
import { useProjectStore } from '../store/projectStore';
import ProjectForm from '../components/ProjectForm';
import { useToastStore } from '@shared/store/toastStore';
import { useConfirmStore } from '@shared/store/confirmStore';
import { PROJECT_PRIORITY } from '@shared/constants';
import { apiClient } from '@shared/utils/apiClient';

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
  const [showArchived, setShowArchived] = useState(false);
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // 动态生成状态选项（支持多语言）
  const statusOptions = useMemo(() => [
    { value: 'all', label: t('projects.statusOptions.all') },
    { value: 'planning', label: t('projects.statusOptions.planning') },
    { value: 'active', label: t('projects.statusOptions.active') },
    { value: 'completed', label: t('projects.statusOptions.completed') },
  ], [t]);

  // 动态生成优先级选项（支持多语言）
  const priorityOptions = useMemo(() => [
    { value: PROJECT_PRIORITY.HIGH, label: t('projects.priorityOptions.high'), color: '#EF4444' },
    { value: PROJECT_PRIORITY.MEDIUM, label: t('projects.priorityOptions.medium'), color: '#F59E0B' },
    { value: PROJECT_PRIORITY.LOW, label: t('projects.priorityOptions.low'), color: '#10B981' },
  ], [t]);

  // 动态生成排序选项（支持多语言）
  const sortOptions = useMemo(() => [
    { value: 'createdAt', label: t('projects.sortOptions.createdAt') },
    { value: 'updatedAt', label: t('projects.sortOptions.updatedAt') },
    { value: 'name', label: t('projects.sortOptions.name') },
    { value: 'progress', label: t('projects.sortOptions.progress') },
  ], [t]);

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
    let filtered = projects.filter(project => {
      // 归档筛选
      if (!showArchived && project.archived) return false;
      if (showArchived && !project.archived) return false;
      
      // 收藏筛选
      if (showStarredOnly && !project.starred) return false;
      
      // 状态筛选
      const statusMatch = filterStatus === 'all' || project.status === filterStatus;
      
      // 优先级筛选
      const priorityMatch = priorityFilter === 'all' || project.priority === priorityFilter;
      
      // 搜索筛选
      const searchMatch = !searchQuery || 
        project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return statusMatch && priorityMatch && searchMatch;
    });
    
    // 排序
    filtered.sort((a, b) => {
      let aVal, bVal;
      switch (sortBy) {
        case 'name':
          aVal = a.name || '';
          bVal = b.name || '';
          break;
        case 'updatedAt':
          aVal = new Date(a.updatedAt || 0);
          bVal = new Date(b.updatedAt || 0);
          break;
        case 'progress':
          aVal = a.progress || 0;
          bVal = b.progress || 0;
          break;
        default: // createdAt
          aVal = new Date(a.createdAt || 0);
          bVal = new Date(b.createdAt || 0);
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });
    
    return filtered;
  }, [projects, filterStatus, searchQuery, showArchived, showStarredOnly, priorityFilter, sortBy, sortOrder]);

  const handleSubmit = async (projectData) => {
    try {
      await submitForm(projectData);
      if (projectData.id) {
        showSuccess(t('projects.updateSuccess'));
      } else {
        showSuccess(t('projects.createSuccess'));
      }
      fetchProjects();
    } catch (error) {
      if (projectData.id) {
        showError(t('projects.updateError'));
      } else {
        showError(t('projects.createError'));
      }
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

  const handleToggleStar = async (projectId, e) => {
    e.stopPropagation();
    try {
      await apiClient.post(`/projects/${projectId}/star`);
      showSuccess(t('projects.starSuccess'));
      fetchProjects();
    } catch (error) {
      showError(t('projects.starError'));
    }
  };

  const handleArchive = async (projectId, e) => {
    e.stopPropagation();
    try {
      await apiClient.post(`/projects/${projectId}/archive`);
      showSuccess(t('projects.archiveSuccess'));
      fetchProjects();
    } catch (error) {
      showError(t('projects.archiveError'));
    }
  };

  const handleUnarchive = async (projectId, e) => {
    e.stopPropagation();
    try {
      await apiClient.post(`/projects/${projectId}/unarchive`);
      showSuccess(t('projects.unarchiveSuccess'));
      fetchProjects();
    } catch (error) {
      showError(t('projects.unarchiveError'));
    }
  };

  const handleClone = async (projectId, e) => {
    e.stopPropagation();
    try {
      await apiClient.post(`/projects/${projectId}/clone`, {});
      showSuccess(t('projects.cloneSuccess'));
      fetchProjects();
    } catch (error) {
      showError(t('projects.cloneError'));
    }
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
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="flex-1 min-w-[200px]">
              <Input
                type="search"
                placeholder={t('projects.search')}
                value={localSearchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="relative group">
                <Select
                  value={filterStatus}
                  onChange={handleFilterChange}
                  options={statusOptions}
                />
                <span className="absolute bottom-full left-0 mb-1 px-2 py-1 text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  {t('projects.filters.statusFilter')}
                </span>
              </div>
              <div className="relative group">
                <Select
                  value={priorityFilter}
                  onChange={setPriorityFilter}
                  options={[
                    { value: 'all', label: t('projects.filters.allPriorities') },
                    ...priorityOptions
                  ]}
                />
                <span className="absolute bottom-full left-0 mb-1 px-2 py-1 text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  {t('projects.filters.priorityFilter')}
                </span>
              </div>
              <div className="relative group">
                <Select
                  value={sortBy}
                  onChange={setSortBy}
                  options={sortOptions}
                />
                <span className="absolute bottom-full left-0 mb-1 px-2 py-1 text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  {t('projects.filters.sortField')}
                </span>
              </div>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors group relative"
                title={t('projects.filters.sortToggle', {
                  current: sortOrder === 'asc' ? t('projects.filters.sortAsc') : t('projects.filters.sortDesc'),
                  next: sortOrder === 'asc' ? t('projects.filters.sortDesc') : t('projects.filters.sortAsc')
                })}
              >
                <ArrowUpDown className="w-4 h-4" />
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  {sortOrder === 'asc' ? t('projects.filters.sortAsc') : t('projects.filters.sortDesc')}
                </span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowStarredOnly(!showStarredOnly)}
                className={`px-3 py-2 rounded-lg transition-colors group relative ${
                  showStarredOnly ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 hover:bg-white/10'
                }`}
                title={showStarredOnly ? t('projects.filters.showAll') : t('projects.filters.starredOnly')}
              >
                <Star className={`w-4 h-4 ${showStarredOnly ? 'fill-current' : ''}`} />
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  {showStarredOnly ? t('projects.filters.showAll') : t('projects.filters.starredOnly')}
                </span>
              </button>
              <button
                onClick={() => setShowArchived(!showArchived)}
                className={`px-3 py-2 rounded-lg transition-colors group relative ${
                  showArchived ? 'bg-slate-500/20 text-slate-400' : 'bg-white/5 hover:bg-white/10'
                }`}
                title={showArchived ? t('projects.filters.showActive') : t('projects.filters.showArchived')}
              >
                <Archive className="w-4 h-4" />
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  {showArchived ? t('projects.filters.showActive') : t('projects.filters.showArchived')}
                </span>
              </button>
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
                          <div className="project-info flex items-center gap-3">
                            <div className="project-avatar flex-shrink-0">
                              {project.coverImage ? (
                                <img src={project.coverImage} alt={project.name} className="w-10 h-10 rounded-lg object-cover" />
                              ) : (
                                <Users className="w-5 h-5 text-slate-400" />
                              )}
                            </div>
                            <div className="project-details flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 
                                  className="project-name cursor-pointer hover:text-primary-400 transition-colors truncate text-sm font-semibold"
                                  onClick={() => handleProjectClick(project.id)}
                                  title={project.name}
                                >
                                  {project.name}
                                </h3>
                              </div>
                              {project.description && (
                                <p 
                                  className="project-description cursor-pointer hover:text-slate-300 transition-colors text-xs text-slate-400 truncate mt-0.5"
                                  onClick={() => handleProjectClick(project.id)}
                                  title={project.description}
                                >
                                  {project.description}
                                </p>
                              )}
                              {project.tags && project.tags.length > 0 && (
                                <div className="flex items-center gap-1 mt-1.5">
                                  {project.tags.slice(0, 2).map((tag, idx) => (
                                    <span
                                      key={idx}
                                      className="px-1.5 py-0.5 text-xs rounded bg-primary-500/15 text-primary-300 truncate max-w-[80px]"
                                      title={tag}
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                  {project.tags.length > 2 && (
                                    <span className="px-1.5 py-0.5 text-xs rounded bg-white/5 text-slate-400">
                                      +{project.tags.length - 2}
                                    </span>
                                  )}
                                </div>
                              )}
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
                          <div className="flex items-center gap-2">
                            <span className={`status-badge status-${project.status}`}>
                              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                            </span>
                            {project.priority && (
                              <span
                                className="px-2 py-0.5 text-xs rounded-full font-medium"
                                  style={{
                                    backgroundColor: priorityOptions.find(p => p.value === project.priority)?.color + '20',
                                    color: priorityOptions.find(p => p.value === project.priority)?.color
                                  }}
                                title={`${t('projects.filters.priorityFilter')}: ${priorityOptions.find(p => p.value === project.priority)?.label || project.priority}`}
                              >
                                {priorityOptions.find(p => p.value === project.priority)?.label || project.priority}
                              </span>
                            )}
                            {project.starred && (
                              <Star className="w-4 h-4 text-yellow-400 fill-current" title="已收藏" />
                            )}
                            {project.archived && (
                              <Archive className="w-4 h-4 text-slate-400" title="已归档" />
                            )}
                          </div>
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
                          <div className="actions flex items-center gap-1">
                            <button 
                              className={`action-btn ${project.starred ? 'text-yellow-400' : ''}`}
                              onClick={(e) => handleToggleStar(project.id, e)}
                              title={project.starred ? '取消收藏' : '收藏'}
                            >
                              <Star className={`w-4 h-4 ${project.starred ? 'fill-current' : ''}`} />
                            </button>
                            <button 
                              className="action-btn"
                              onClick={(e) => handleClone(project.id, e)}
                              title="复制项目"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button 
                              className="action-btn"
                              onClick={() => openEditForm(project)}
                              title="编辑"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            {!project.archived ? (
                              <button 
                                className="action-btn"
                                onClick={(e) => handleArchive(project.id, e)}
                                title="归档"
                              >
                                <Archive className="w-4 h-4" />
                              </button>
                            ) : (
                              <button 
                                className="action-btn"
                                onClick={(e) => handleUnarchive(project.id, e)}
                                title="取消归档"
                              >
                                <Archive className="w-4 h-4" />
                              </button>
                            )}
                            <button 
                              className="action-btn"
                              onClick={() => handleDeleteClick(project.id)}
                              title="删除"
                            >
                              <Trash2 className="w-4 h-4" />
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

