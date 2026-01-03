import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Select } from '@headlessui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { api } from '../utils/api';

const ProjectForm = ({ isOpen, onClose, onSubmit, initialData = {} }) => {
    const { t } = useTranslation();
    // 确保initialData是一个对象
    const safeInitialData = initialData || {};
    
    // 将deadline转换为Date对象，如果是字符串格式
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

    // 当表单打开时，重置或加载数据
    useEffect(() => {
        if (isOpen) {
            if (safeInitialData.id) {
                // 编辑模式：获取最新项目数据
                const fetchProjectData = async () => {
                    setLoading(true);
                    try {
                        // 调用API获取最新的项目数据
                        const projectData = await api.get(`/projects/${safeInitialData.id}`);
                        // 确保projectData是一个对象
                        const safeProjectData = projectData || {};
                        // 将deadline转换为Date对象
                        const deadlineDate = safeProjectData.deadline 
                            ? new Date(safeProjectData.deadline)
                            : new Date();
                        // 更新表单数据
                        setFormData({
                            ...safeProjectData,
                            deadline: deadlineDate
                        });
                    } catch (error) {
                        console.error('Failed to fetch project data:', error);
                        // 如果获取失败，继续使用initialData
                    } finally {
                        setLoading(false);
                    }
                };

                fetchProjectData();
            } else {
                // 创建模式：重置表单数据
                setFormData({
                    name: '',
                    description: '',
                    status: 'planning',
                    deadline: new Date()
                });
            }
            // 重置错误状态
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

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length === 0) {
            // 将Date对象转换为ISO字符串格式（YYYY-MM-DD），以便后端处理
            const submitData = {
                ...formData,
                deadline: formData.deadline.toISOString().split('T')[0]
            };
            onSubmit(submitData);
            onClose();
        } else {
            setErrors(validationErrors);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // 清除对应字段的错误
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="glass-card p-8 rounded-3xl w-full max-w-lg mx-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        {safeInitialData.id ? t('projects.form.editTitle') : t('projects.form.createTitle')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                            {t('projects.form.name')}
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full bg-white/5 border ${errors.name ? 'border-rose-500' : 'border-white/5'} rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all`}
                            placeholder={t('projects.form.namePlaceholder')}
                        />
                        {errors.name && <p className="text-rose-400 text-xs mt-1">{errors.name}</p>}
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
                                className={`w-full bg-white/5 border ${errors.status ? 'border-rose-500' : 'border-white/5'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all`}
                            >
                                <option value="planning">{t('projects.status.planning')}</option>
                                <option value="active">{t('projects.status.active')}</option>
                                <option value="completed">{t('projects.status.completed')}</option>
                            </Select>
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
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-white/5 text-slate-300 rounded-xl hover:bg-white/10 transition-colors font-medium"
                        >
                            {t('projects.form.cancel')}
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors font-medium shadow-lg shadow-primary-500/20"
                        >
                            {safeInitialData.id ? t('projects.form.update') : t('projects.form.create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectForm;
