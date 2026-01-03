import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Modal, Input, Select, Button } from '@shared/ui';
import { apiClient } from '@shared/utils/apiClient';
import { PROJECT_STATUS_OPTIONS } from '@shared/constants';

const ProjectForm = ({ isOpen, onClose, onSubmit, initialData = {} }) => {
  const { t } = useTranslation();
  const safeInitialData = initialData || {};
  
  const initialDeadline = safeInitialData.deadline 
    ? new Date(safeInitialData.deadline)
    : new Date();

  const [formData, setFormData] = useState({
    name: safeInitialData.name || '',
    description: safeInitialData.description || '',
    status: safeInitialData.status || 'planning',
    deadline: initialDeadline,
    ...safeInitialData
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (safeInitialData.id) {
        const fetchProjectData = async () => {
          setLoading(true);
          try {
            const projectData = await apiClient.get(`/projects/${safeInitialData.id}`);
            const safeProjectData = projectData || {};
            const deadlineDate = safeProjectData.deadline 
              ? new Date(safeProjectData.deadline)
              : new Date();
            setFormData({
              ...safeProjectData,
              deadline: deadlineDate
            });
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
          deadline: new Date()
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
    if (Object.keys(validationErrors).length === 0) {
      const submitData = {
        ...formData,
        deadline: formData.deadline.toISOString().split('T')[0]
      };
      await onSubmit(submitData);
      onClose();
    } else {
      setErrors(validationErrors);
    }
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

  const statusOptions = PROJECT_STATUS_OPTIONS.filter(opt => opt.value !== 'all');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={safeInitialData.id ? t('projects.form.editTitle') : t('projects.form.createTitle')}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
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
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            {t('projects.form.description')}
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`w-full bg-white/5 border ${errors.description ? 'border-rose-500' : 'border-white/5'} rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none`}
            placeholder={t('projects.form.descriptionPlaceholder')}
          />
          {errors.description && <p className="text-rose-400 text-xs mt-1">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              {t('projects.form.status')}
            </label>
            <Select
              value={formData.status}
              onChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              options={statusOptions}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              {t('projects.form.deadline')}
            </label>
            <DatePicker
              selected={formData.deadline}
              onChange={(date) => setFormData(prev => ({ ...prev, deadline: date }))}
              className={`w-full bg-white/5 border ${errors.deadline ? 'border-rose-500' : 'border-white/5'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all`}
              dateFormat="yyyy-MM-dd"
              minDate={new Date()}
            />
            {errors.deadline && <p className="text-rose-400 text-xs mt-1">{errors.deadline}</p>}
          </div>
        </div>

        <div className="flex items-center gap-4 justify-end pt-4 border-t border-white/5">
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

