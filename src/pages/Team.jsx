import { useState, useEffect } from 'react';
import { Plus, Search, MoreHorizontal, Edit, Trash2, Mail, Phone, UserPlus, UserMinus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Team() {
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeamMembers = async () => {
            try {
                // 模拟API请求
                const data = [
                    {
                        id: 1,
                        name: 'Kyle Wong',
                        role: 'Product Manager',
                        email: 'kyle@example.com',
                        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kyle',
                        status: 'online'
                    },
                    {
                        id: 2,
                        name: 'Alex Chen',
                        role: 'Frontend Developer',
                        email: 'alex@example.com',
                        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
                        status: 'online'
                    },
                    {
                        id: 3,
                        name: 'Sarah Johnson',
                        role: 'Backend Developer',
                        email: 'sarah@example.com',
                        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
                        status: 'away'
                    },
                    {
                        id: 4,
                        name: 'Jordan Lee',
                        role: 'Designer',
                        email: 'jordan@example.com',
                        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
                        status: 'offline'
                    },
                    {
                        id: 5,
                        name: 'Michael Brown',
                        role: 'QA Engineer',
                        email: 'michael@example.com',
                        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
                        status: 'online'
                    }
                ];
                setTeamMembers(data);
            } catch (error) {
                console.error('Failed to fetch team members:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTeamMembers();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-white text-xl font-bold animate-pulse">Loading Team Members...</div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Team Members</h1>
                    <p className="text-slate-400 font-medium">管理和查看团队成员</p>
                </div>
                <button className="btn-primary">
                    <Plus className="w-4 h-4" />
                    <span>Invite Member</span>
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-3 glass-card p-6 rounded-3xl">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex-1 max-w-md">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-primary-400 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search team members..."
                                    className="input-search"
                                />
                            </div>
                        </div>
                        <select className="bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-sm text-slate-300 outline-none ml-4">
                            <option>All Members</option>
                            <option>Online</option>
                            <option>Away</option>
                            <option>Offline</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {teamMembers.map((member) => (
                            <motion.div
                                key={member.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass-card p-6 rounded-3xl border border-white/5 hover:border-primary-500/30 transition-all"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 border-2 border-white/10 shadow-xl">
                                                <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                                            </div>
                                            <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0b0f1a] ${member.status === 'online' ? 'bg-emerald-500' : member.status === 'away' ? 'bg-amber-500' : 'bg-slate-500'}`}></span>
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold text-lg">{member.name}</h3>
                                            <p className="text-primary-400 text-sm font-medium">{member.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 text-slate-400 hover:text-primary-400 transition-colors rounded-lg hover:bg-white/5">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-slate-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-white/5">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-slate-400">
                                        <Mail className="w-4 h-4" />
                                        <span className="text-sm">{member.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-400">
                                        <Phone className="w-4 h-4" />
                                        <span className="text-sm">+86 138 **** 8888</span>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-white/5">
                                    <div className="flex items-center justify-between">
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${member.status === 'online' ? 'bg-emerald-500/20 text-emerald-400' : member.status === 'away' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/20 text-slate-400'}`}>
                                            {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                                        </span>
                                        <button className="text-sm text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1">
                                            <UserMinus className="w-3.5 h-3.5" />
                                            <span>Remove</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}