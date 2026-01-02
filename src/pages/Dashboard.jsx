import { useState, useEffect } from 'react';
import { Clock, CheckCircle2, AlertCircle, BarChart3, TrendingUp, Users, Calendar, FileText, Bell, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState([]);
    const [recentTasks, setRecentTasks] = useState([]);
    const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 模拟API请求
                const statsData = [
                    { label: 'dashboard.stats.activeTasks', value: '24', icon: Clock, color: 'text-primary-400', bg: 'bg-primary-500/10', trend: '+3' },
                    { label: 'dashboard.stats.completed', value: '18', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', trend: '+5' },
                    { label: 'dashboard.stats.highPriority', value: '7', icon: AlertCircle, color: 'text-rose-400', bg: 'bg-rose-500/10', trend: '-1' },
                    { label: 'dashboard.stats.teamVelocity', value: '85%', icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10', trend: '+10%' },
                    { label: 'dashboard.stats.projects', value: '6', icon: FileText, color: 'text-purple-400', bg: 'bg-purple-500/10', trend: '+1' },
                    { label: 'dashboard.stats.teamMembers', value: '16', icon: Users, color: 'text-teal-400', bg: 'bg-teal-500/10', trend: '0' },
                ];

                const recentTasksData = [
                    { id: 1, title: '实现看板拖拽功能', project: 'TaskFlow', status: 'IN_PROGRESS', priority: 'High' },
                    { id: 2, title: '设计团队协作页面', project: 'FlowChat', status: 'TODO', priority: 'Medium' },
                    { id: 3, title: '优化API响应速度', project: 'Analytics Dashboard', status: 'DONE', priority: 'High' },
                    { id: 4, title: '添加用户权限管理', project: 'TaskFlow', status: 'REVIEW', priority: 'Medium' },
                ];

                const deadlinesData = [
                    { id: 1, title: '完成前端原型设计', project: 'TaskFlow', date: '2024-10-15', assignee: 'Alex' },
                    { id: 2, title: 'API文档编写', project: 'FlowChat', date: '2024-10-18', assignee: 'Sarah' },
                    { id: 3, title: '系统测试', project: 'Analytics Dashboard', date: '2024-10-22', assignee: 'Jordan' },
                ];

                setStats(statsData);
                setRecentTasks(recentTasksData);
                setUpcomingDeadlines(deadlinesData);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-white text-xl font-bold animate-pulse">Loading Dashboard...</div>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <header className="max-w-[1600px] w-full mx-auto">
                <h1 className="dashboard-header-title">{t('dashboard.welcome')}</h1>
                <p className="dashboard-header-desc">{t('dashboard.subtitle')}</p>
            </header>

            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-6 rounded-3xl"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div className={`flex items-center gap-1 text-sm font-bold ${stat.trend.startsWith('+') ? 'text-emerald-400' : stat.trend.startsWith('-') ? 'text-rose-400' : 'text-slate-500'}`}>
                                {stat.trend.startsWith('+') ? <ArrowUpRight className="w-3.5 h-3.5" /> : stat.trend.startsWith('-') ? <ArrowDownRight className="w-3.5 h-3.5" /> : null}
                                <span>{stat.trend}</span>
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">{t(stat.label)}</p>
                        <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            {/* 主要内容区域 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 项目活动图表 */}
                <div className="lg:col-span-2 glass-card p-8 rounded-3xl">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <BarChart3 className="text-primary-400 w-6 h-6" />
                            <h3 className="text-xl font-bold text-white">{t('dashboard.projectActivity')}</h3>
                        </div>
                        <select className="bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-sm text-slate-300 outline-none">
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                            <option>Last 90 days</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-center h-64 text-slate-500 border-2 border-dashed border-white/5 rounded-2xl italic">
                        Activity visualization placeholder
                    </div>
                </div>

                {/* 即将到来的截止日期 */}
                <div className="glass-card p-8 rounded-3xl">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <Calendar className="text-primary-400 w-6 h-6" />
                            <h3 className="text-xl font-bold text-white">{t('dashboard.upcomingDeadlines')}</h3>
                        </div>
                        <button className="text-sm text-primary-400 hover:text-primary-300 transition-colors">{t('dashboard.viewAll')}</button>
                    </div>
                    <div className="space-y-6">
                        {upcomingDeadlines.map((deadline) => (
                            <div key={deadline.id} className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-primary-400 flex-shrink-0">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-white font-semibold text-sm mb-1">{deadline.title}</h4>
                                    <div className="flex items-center gap-2 text-slate-500 text-xs mb-2">
                                        <span>{deadline.project}</span>
                                        <span>•</span>
                                        <span>{deadline.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-semibold px-2.5 py-1 bg-white/5 rounded-full text-slate-400">
                                            {deadline.assignee}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 最近任务和团队活动 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 最近任务 */}
                <div className="lg:col-span-2 glass-card p-8 rounded-3xl">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <FileText className="text-primary-400 w-6 h-6" />
                            <h3 className="text-xl font-bold text-white">{t('dashboard.recentTasks')}</h3>
                        </div>
                        <button className="text-sm text-primary-400 hover:text-primary-300 transition-colors">{t('dashboard.viewAll')}</button>
                    </div>
                    <div className="space-y-5">
                        {recentTasks.map((task) => (
                            <div key={task.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-4">
                                    <span className={`w-3 h-3 rounded-full ${task.status === 'IN_PROGRESS' ? 'bg-primary-500' : task.status === 'TODO' ? 'bg-slate-500' : task.status === 'DONE' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                    <div>
                                        <h4 className="text-white font-semibold text-sm">{task.title}</h4>
                                        <p className="text-slate-500 text-xs">{task.project}</p>
                                    </div>
                                </div>
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${task.priority === 'High' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                    {task.priority}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 团队活动 */}
                <div className="glass-card p-8 rounded-3xl">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <Bell className="text-primary-400 w-6 h-6" />
                            <h3 className="text-xl font-bold text-white">{t('dashboard.teamActivity')}</h3>
                        </div>
                        <button className="text-sm text-primary-400 hover:text-primary-300 transition-colors">{t('dashboard.viewAll')}</button>
                    </div>
                    <div className="space-y-6">
                        {[1, 2, 3, 4, 5].map((activityId) => (
                            <div key={activityId} className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=User${activityId}`} alt="User" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-white text-sm">
                                        <span className="font-semibold">Team Member {activityId}</span>
                                        <span className="text-slate-500"> updated task "Implement login feature"</span>
                                    </p>
                                    <p className="text-slate-500 text-xs mt-1">2 hours ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
