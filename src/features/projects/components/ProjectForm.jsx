import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Input, Select, Button, DatePicker, ImageUpload } from '@shared/ui';
import { apiClient } from '@shared/utils/apiClient';
import { PROJECT_PRIORITY } from '@shared/constants';
import { useConfirmStore } from '@shared/store/confirmStore';

const ProjectForm = ({ isOpen, onClose, onSubmit, initialData = {} }) => {
  const { t } = useTranslation();
  const { openConfirm } = useConfirmStore();
  const safeInitialData = initialData || {};

  // 动态生成状态选项（支持多语言）
  const statusOptions = useMemo(() => [
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
  
  const initialDeadline = safeInitialData.deadline 
    ? new Date(safeInitialData.deadline)
    : new Date();
  const initialStartDate = safeInitialData.startDate 
    ? new Date(safeInitialData.startDate)
    : null;

  const [formData, setFormData] = useState({
    name: safeInitialData.name || '',
    description: safeInitialData.description || '',
    status: safeInitialData.status || 'planning',
    deadline: initialDeadline,
    startDate: initialStartDate,
    priority: safeInitialData.priority || 'MEDIUM',
    coverImage: safeInitialData.coverImage || '',
    tags: safeInitialData.tags || [],
    teamIds: safeInitialData.teams?.map(t => t.id) || [],
    ...safeInitialData
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [originalTeamIds, setOriginalTeamIds] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // 加载可用团队
      const fetchTeams = async () => {
        setLoadingTeams(true);
        try {
          const teams = await apiClient.get('/projects/teams/available');
          setAvailableTeams(teams || []);
        } catch (error) {
          console.error('Failed to fetch teams:', error);
        } finally {
          setLoadingTeams(false);
        }
      };
      fetchTeams();

      if (safeInitialData.id) {
        const fetchProjectData = async () => {
          setLoading(true);
          try {
            const projectData = await apiClient.get(`/projects/${safeInitialData.id}`);
            const safeProjectData = projectData || {};
            const deadlineDate = safeProjectData.deadline 
              ? new Date(safeProjectData.deadline)
              : new Date();
            const startDate = safeProjectData.startDate 
              ? new Date(safeProjectData.startDate)
              : null;
            const teamIds = safeProjectData.teams?.map(t => t.id) || [];
            setFormData({
              ...safeProjectData,
              deadline: deadlineDate,
              startDate: startDate,
              priority: safeProjectData.priority || 'MEDIUM',
              coverImage: safeProjectData.coverImage || '',
              tags: safeProjectData.tags || [],
              teamIds: teamIds
            });
            setOriginalTeamIds(teamIds);
          } catch (error) {
            console.error('Failed to fetch project data:', error);
          } finally {
            setLoading(false);
          }
        };
        fetchProjectData();
      } else {
        setFormData({
          name: '',
          description: '',
          status: 'planning',
          deadline: new Date(),
          startDate: null,
          priority: 'MEDIUM',
          coverImage: '',
          tags: [],
          teamIds: []
        });
      }
      setErrors({});
    }
  }, [isOpen, safeInitialData.id]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = t('projects.form.errors.name');
    }
    if (!formData.description.trim()) {
      newErrors.description = t('projects.form.errors.description');
    }
    if (!formData.deadline) {
      newErrors.deadline = t('projects.form.errors.deadline');
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const submitData = {
      ...formData,
      deadline: formData.deadline ? formData.deadline.toISOString().split('T')[0] : null,
      startDate: formData.startDate ? formData.startDate.toISOString().split('T')[0] : null,
      teamIds: formData.teamIds || [],
      tags: formData.tags || []
    };

    // 如果是编辑项目，检查团队是否减少
    if (safeInitialData.id) {
      const newTeamIds = submitData.teamIds || [];
      const removedTeamIds = originalTeamIds.filter(id => !newTeamIds.includes(id));
      
      if (removedTeamIds.length > 0) {
        // 检查移除团队对成员的影响
        try {
          const affectedMembers = await apiClient.post(
            `/projects/${safeInitialData.id}/teams/removal-impact`,
            { newTeamIds }
          );

          if (affectedMembers && affectedMembers.length > 0) {
            // 弹窗提示用户
            openConfirm({
              title: t('projects.form.teamRemovalWarning.title'),
              message: t('projects.form.teamRemovalWarning.message', { 
                count: affectedMembers.length,
                members: affectedMembers.map(m => m.name).join('、')
              }),
              confirmText: t('projects.form.teamRemovalWarning.confirm'),
              cancelText: t('common.cancel'),
              variant: 'danger',
              onConfirm: async () => {
                await onSubmit(submitData);
                onClose();
              }
            });
            return;
          }
        } catch (error) {
          console.error('Failed to check team removal impact:', error);
          // 如果检查失败，直接提交
        }
      }
    }

    // 没有影响或创建项目，直接提交
    await onSubmit(submitData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // statusOptions 已在上面定义，不需要过滤

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={safeInitialData.id ? t('projects.form.editTitle') : t('projects.form.createTitle')}
      size="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* 第一行：项目名称和描述 */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t('projects.form.name')}
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t('projects.form.namePlaceholder')}
              error={errors.name}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t('projects.form.description')}
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className={`w-full bg-white/5 border ${errors.description ? 'border-rose-500' : 'border-white/5'} rounded-xl px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none text-sm`}
              placeholder={t('projects.form.descriptionPlaceholder')}
            />
            {errors.description && <p className="text-rose-400 text-xs mt-1">{errors.description}</p>}
          </div>
        </div>

        {/* 第二行：关联团队 */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            {t('projects.form.teams')}
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-2">
            {loadingTeams ? (
              <div className="py-8 text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-primary-500 border-t-transparent"></div>
                <p className="text-slate-400 text-sm mt-2">{t('common.loading')}</p>
              </div>
            ) : availableTeams.length === 0 ? (
              <div className="py-8 text-center bg-white/5 rounded-xl border border-white/10">
                <p className="text-slate-400 text-sm">{t('projects.form.noTeams')}</p>
              </div>
            ) : (
              availableTeams.map((team) => {
                const isSelected = formData.teamIds?.includes(team.id) || false;
                return (
                  <label
                    key={team.id}
                    className={`group relative flex items-start gap-2 p-2 rounded-lg border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-primary-500/10 border-primary-500/50 shadow-lg shadow-primary-500/10'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="relative flex-shrink-0 mt-0.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          const teamIds = formData.teamIds || [];
                          if (e.target.checked) {
                            setFormData(prev => ({ ...prev, teamIds: [...teamIds, team.id] }));
                          } else {
                            setFormData(prev => ({ ...prev, teamIds: teamIds.filter(id => id !== team.id) }));
                          }
                        }}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-primary-500 border-primary-500'
                            : 'bg-white/5 border-white/30 group-hover:border-primary-500/50'
                        }`}
                      >
                        {isSelected && (
                          <svg
                            className="w-3.5 h-3.5 text-white"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full ${
                          isSelected ? 'bg-primary-500' : 'bg-slate-500'
                        }`}></div>
                        <p className={`font-semibold ${
                          isSelected ? 'text-white' : 'text-slate-200'
                        }`}>
                          {team.name}
                        </p>
                      </div>
                      {team.description && (
                        <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
                          {team.description}
                        </p>
                      )}
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center">
                          <svg
                            className="w-3.5 h-3.5 text-primary-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </label>
                );
              })
            )}
          </div>
        </div>

        {/* 第三行：状态、优先级、开始日期、截止日期 */}
        <div className="grid grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t('projects.form.status')}
            </label>
            <Select
              value={formData.status}
              onChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              options={statusOptions}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t('projects.form.priority')}
            </label>
            <Select
              value={formData.priority}
              onChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
              options={priorityOptions}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t('projects.form.startDate')}
            </label>
            <DatePicker
              selected={formData.startDate}
              onChange={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
              placeholder={t('projects.form.startDatePlaceholder')}
              isClearable
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t('projects.form.deadline')}
            </label>
            <DatePicker
              selected={formData.deadline}
              onChange={(date) => setFormData(prev => ({ ...prev, deadline: date }))}
              placeholder={t('projects.form.deadlinePlaceholder')}
              minDate={formData.startDate || new Date()}
              error={errors.deadline}
            />
            {errors.deadline && <p className="text-rose-400 text-xs mt-1">{errors.deadline}</p>}
          </div>
        </div>

        {/* 第四行：封面图片和标签 */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t('projects.form.coverImage')}
            </label>
            <ImageUpload
              value={formData.coverImage}
              onChange={(url) => setFormData(prev => ({ ...prev, coverImage: url }))}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t('projects.form.tags')}
            </label>
            <div className="flex flex-wrap gap-1.5 mb-1.5">
              {formData.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-primary-500/20 text-primary-300 rounded-full text-xs flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        tags: prev.tags.filter((_, i) => i !== idx)
                      }));
                    }}
                    className="hover:text-primary-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <Input
              type="text"
              placeholder={t('projects.form.tagsPlaceholder')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  e.preventDefault();
                  const newTag = e.target.value.trim();
                  if (!formData.tags.includes(newTag)) {
                    setFormData(prev => ({
                      ...prev,
                      tags: [...prev.tags, newTag]
                    }));
                  }
                  e.target.value = '';
                }
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 justify-end pt-2 border-t border-white/5 mt-3">
          <Button variant="ghost" type="button" onClick={onClose}>
            {t('projects.form.cancel')}
          </Button>
          <Button type="submit" loading={loading}>
            {safeInitialData.id ? t('projects.form.update') : t('projects.form.create')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectForm;

