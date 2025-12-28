import { motion } from 'framer-motion';
import { Clock, CheckCircle2, AlertCircle, BarChart3, TrendingUp, Users } from 'lucide-react';

const stats = [
    { label: 'Active Tasks', value: '12', icon: Clock, color: 'text-primary-400', bg: 'bg-primary-500/10' },
    { label: 'Completed', value: '48', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'High Priority', value: '3', icon: AlertCircle, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { label: 'Team Velocity', value: '94%', icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10' },
];

export default function Dashboard() {
    return (
        <div className="space-y-10 max-w-7xl mx-auto">
            <header>
                <h1 className="dashboard-header-title">Welcome back, Kyle!</h1>
                <p className="dashboard-header-desc">Here's what's happening in your projects today.</p>
            </header>

            <div className="stats-grid">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-6 rounded-3xl"
                    >
                        <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mb-4`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card p-8 rounded-3xl min-h-[400px]">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <BarChart3 className="text-primary-400 w-6 h-6" />
                            <h3 className="text-xl font-bold text-white">Project Activity</h3>
                        </div>
                        <select className="bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-sm text-slate-300 outline-none">
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-center h-64 text-slate-500 border-2 border-dashed border-white/5 rounded-2xl italic">
                        Activity visualization placeholder
                    </div>
                </div>

                <div className="glass-card p-8 rounded-3xl">
                    <div className="flex items-center gap-3 mb-8">
                        <Users className="text-primary-400 w-6 h-6" />
                        <h3 className="text-xl font-bold text-white">Active Team</h3>
                    </div>
                    <div className="space-y-6">
                        {[1, 2, 3, 4].map((u) => (
                            <div key={u} className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${u}`} className="w-8 h-8" alt="user" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors">Team Member {u}</p>
                                        <p className="text-xs text-slate-500 font-medium">Working on Sprint 2</p>
                                    </div>
                                </div>
                                <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
