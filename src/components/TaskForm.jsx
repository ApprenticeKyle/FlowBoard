import { useState } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Select } from '@headlessui/react';

const TaskForm = ({ isOpen, onClose, onSubmit, initialData = {} }) => {
    const { t } = useTranslation();
    // 确保initialData是一个对象
    const safeInitialData = initialData || {};
    
    const [formData, setFormData] = useState({
        title: safeInitialData.title || '',
        description: safeInitialData.description || '',
        status: safeInitialData.status || 'TODO',
        priority: safeInitialData.priority || 'Medium',
        ...safeInitialData
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) {
            newErrors.title = '请输入任务标题';
        }
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length === 0) {
            onSubmit(formData);
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
                        {safeInitialData.id ? '编辑任务' : '创建任务'}
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
                            任务标题
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={`w-full bg-white/5 border ${errors.title ? 'border-rose-500' : 'border-white/5'} rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all`}
                            placeholder="输入任务标题"
                        />
                        {errors.title && <p className="text-rose-400 text-xs mt-1">{errors.title}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                            任务描述
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none"
                            placeholder="输入任务描述"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2">
                                优先级
                            </label>
                            <Select
                                value={formData.priority}
                                onChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                                className={`w-full bg-white/5 border ${errors.priority ? 'border-rose-500' : 'border-white/5'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all`}
                            >
                                <option value="High">高</option>
                                <option value="Medium">中</option>
                                <option value="Low">低</option>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2">
                                状态
                            </label>
                            <Select
                                value={formData.status}
                                onChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                                className={`w-full bg-white/5 border ${errors.status ? 'border-rose-500' : 'border-white/5'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all`}
                            >
                                <option value="TODO">To Do</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="REVIEW">Review</option>
                                <option value="DONE">Done</option>
                            </Select>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 justify-end pt-4 border-t border-white/5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-white/5 text-slate-300 rounded-xl hover:bg-white/10 transition-colors font-medium"
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors font-medium shadow-lg shadow-primary-500/20"
                        >
                            {safeInitialData.id ? '更新' : '创建'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;