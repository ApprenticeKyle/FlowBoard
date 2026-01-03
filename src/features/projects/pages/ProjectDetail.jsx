import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Calendar, Users, TrendingUp, FileText, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button, Card } from '@shared/ui';
import { PageContainer } from '@shared/components';
import { useProjectStore } from '../store/projectStore';
import { useToastStore } from '@shared/store/toastStore';
import { useConfirmStore } from '@shared/store/confirmStore';
import { apiClient } from '@shared/utils/apiClient';
import ProjectMembers from '../components/ProjectMembers';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [project, setProject] = useState(null);
  const [projectMembers, setProjectMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { openEditForm, deleteProject } = useProjectStore();
  const { showSuccess, showError } = useToastStore();
  const { openConfirm } = useConfirmStore();

  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        setLoading(true);
        const data = await apiClient.get(`/projects/${id}`);
        setProject(data);
        
        // 获取项目成员（从API返回的数据中获取）
        setProjectMembers(data.projectMembers || []);
      } catch (error) {
        console.error('Failed to fetch project detail:', error);
        showError(t('projects.fetchError'));
        navigate('/projects');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProjectDetail();
    }
  }, [id, navigate, showError, t]);

  const handleDelete = async () => {
    try {
      await deleteProject(id);
      showSuccess(t('projects.deleteSuccess'));
      navigate('/projects');
    } catch (error) {
      showError(t('projects.deleteError'));
    }
  };

  const handleDeleteClick = () => {
    openConfirm({
      title: t('projects.deleteConfirmTitle'),
      message: t('projects.deleteConfirmMessage'),
      onConfirm: handleDelete,
    });
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-96">
          <div className="text-white text-xl font-bold animate-pulse">{t('common.loading')}</div>
        </div>
      </PageContainer>
    );
  }

  if (!project) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center h-96 text-slate-400">
          <FileText className="w-16 h-16 mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">{t('projects.notFound')}</h3>
          <Button icon={ArrowLeft} onClick={() => navigate('/projects')}>
            {t('common.backToProjects')}
          </Button>
        </div>
      </PageContainer>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/20 text-emerald-400';
      case 'completed':
        return 'bg-primary-500/20 text-primary-400';
      case 'planning':
      default:
        return 'bg-amber-500/20 text-amber-400';
    }
  };

  return (
    <PageContainer>
      <div className="space-y-8 w-full">
        {/* 头部 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              icon={ArrowLeft}
              onClick={() => navigate('/projects')}
            >
              {t('common.back')}
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{project.name}</h1>
              <p className="text-slate-400 font-medium">{t('projects.detail.subtitle')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              icon={Edit}
              onClick={() => openEditForm(project)}
            >
              {t('common.edit')}
            </Button>
            <Button
              variant="danger"
              icon={Trash2}
              onClick={handleDeleteClick}
            >
              {t('common.delete')}
            </Button>
          </div>
        </div>

        {/* 项目信息卡片 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 主要信息 */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white">{t('projects.detail.description')}</h3>
              </div>
              <div>
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {project.description || t('projects.noDescription')}
                </p>
              </div>
            </Card>

            {/* 项目统计 */}
            <Card>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white">{t('projects.detail.statistics')}</h3>
              </div>
              <div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary-400" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">{t('projects.detail.members')}</p>
                      <p className="text-white text-2xl font-bold">{projectMembers.length || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">{t('projects.detail.progress')}</p>
                      <p className="text-white text-2xl font-bold">{project.progress || 0}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* 项目成员 */}
            <ProjectMembers
              projectId={id}
              members={projectMembers}
              teams={project.teams || []}
              onMembersChange={setProjectMembers}
            />
          </div>

          {/* 侧边栏信息 */}
          <div className="space-y-6">
            <Card>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white">{t('projects.detail.info')}</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-slate-400 text-sm mb-2">{t('projects.detail.status')}</p>
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold ${getStatusColor(project.status)}`}>
                    {project.status ? project.status.charAt(0).toUpperCase() + project.status.slice(1) : 'Planning'}
                  </span>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-2">{t('projects.detail.deadline')}</p>
                  <div className="flex items-center gap-2 text-white">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>{project.deadline || t('projects.noDeadline')}</span>
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-2">{t('projects.detail.createdAt')}</p>
                  <div className="flex items-center gap-2 text-white">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{project.createdAt ? new Date(project.createdAt).toLocaleDateString() : '-'}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

