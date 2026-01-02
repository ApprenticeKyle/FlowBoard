import { useState, useEffect } from 'react';
import { Plus, Search, MoreHorizontal, Edit, Trash2, Users, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // 模拟API请求
                const data = [
                    {
                        id: 1,
                        name: 'TaskFlow',
                        description: '团队任务协作平台',
                        members: 16,
                        status: 'active',
                        deadline: '2024-12-31',
                        progress: 65
                    },
                    {
                        id: 2,
                        name: 'FlowChat',
                        description: '实时团队通信系统',
                        members: 8,
                        status: 'active',
                        deadline: '2024-11-15',
                        progress: 45
                    },
                    {
                        id: 3,
                        name: 'Analytics Dashboard',
                        description: '数据可视化分析平台',
                        members: 12,
                        status: 'planning',
                        deadline: '2025-02-28',
                        progress: 10
                    }
                ];
                setProjects(data);
            } catch (error) {
                console.error('Failed to fetch projects:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

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
                    <button className="btn-primary">
                        <Plus className="w-4 h-4" />
                        <span>{t('projects.newProject')}</span>
                    </button>
                </div>
            </header>

            <div className="glass-card p-6 rounded-3xl">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex-1 max-w-md">
                        <div className="relative group mb-6">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-primary-400 transition-colors" />
                            <input
                                type="text"
                                placeholder={t('projects.search')}
                                className="input-search"
                            />
                        </div>
                    </div>
                    <select className="bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-sm text-slate-300 outline-none ml-4">
                            <option>{t('projects.allProjects')}</option>
                            <option>{t('projects.status.active')}</option>
                            <option>{t('projects.status.planning')}</option>
                            <option>{t('projects.status.completed')}</option>
                        </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="pb-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">{t('projects.table.project')}</th>
                                <th className="pb-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">{t('projects.table.members')}</th>
                                <th className="pb-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">{t('projects.table.status')}</th>
                                <th className="pb-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">{t('projects.table.deadline')}</th>
                                <th className="pb-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">{t('projects.table.progress')}</th>
                                <th className="pb-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">{t('projects.table.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project) => (
                                <motion.tr
                                    key={project.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                                >
                                    <td className="py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400">
                                                <Users className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-white font-semibold">{project.name}</h3>
                                                <p className="text-slate-500 text-sm">{project.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5">
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <Users className="w-4 h-4" />
                                            <span>{project.members}</span>
                                        </div>
                                    </td>
                                    <td className="py-5">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${project.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : project.status === 'planning' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/20 text-slate-400'}`}>
                                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="py-5">
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <Calendar className="w-4 h-4" />
                                            <span>{project.deadline}</span>
                                        </div>
                                    </td>
                                    <td className="py-5">
                                        <div className="w-40">
                                            <div className="flex items-center justify-between text-sm mb-1">
                                                <span className="text-slate-400">{project.progress}%</span>
                                            </div>
                                            <div className="w-full bg-white/10 rounded-full h-2">
                                                <div 
                                                    className="h-full rounded-full bg-primary-500 transition-all duration-300"
                                                    style={{ width: `${project.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5">
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 text-slate-400 hover:text-primary-400 transition-colors rounded-lg hover:bg-white/5">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-white/5">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}