import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Calendar, Clock, Users, Tag, MessageSquare, Paperclip, Edit, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TaskDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTaskDetail = async () => {
            try {
                // 模拟API请求
                const data = {
                    id: parseInt(id),
                    title: '实现看板拖拽功能',
                    description: '为看板任务添加拖拽功能，支持在不同状态列之间移动任务。使用react-beautiful-dnd库实现拖拽效果，并确保拖拽后的数据能正确保存到后端。',
                    status: 'IN_PROGRESS',
                    priority: 'High',
                    assignees: ['Alex', 'Kyle'],
                    dueDate: '2024-10-15',
                    createdAt: '2024-10-01',
                    updatedAt: '2024-10-05',
                    comments: 5,
                    attachments: 2,
                    tags: ['前端', '功能开发']
                };
                setTask(data);
            } catch (error) {
                console.error('Failed to fetch task details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTaskDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-white text-xl font-bold animate-pulse">Loading Task Details...</div>
            </div>
        );
    }

    if (!task) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-white text-xl font-bold">Task not found</div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col space-y-8 font-inter">
            <div className="flex items-center gap-4">
                <button 
                    className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="w-5 h-5 text-white" />
                </button>
                <h1 className="text-3xl font-bold text-white">Task Detail</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 主内容区域 */}
                <div className="lg:col-span-2 space-y-8">
                    {/* 任务基本信息 */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-8 rounded-3xl"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <span className={`badge-priority mr-3 ${task.priority === 'High' ? 'bg-rose-500/10 text-rose-400' : task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                    {task.priority}
                                </span>
                                <span className={`badge-priority ${task.status === 'TODO' ? 'bg-blue-500/10 text-blue-400' : task.status === 'IN_PROGRESS' ? 'bg-purple-500/10 text-purple-400' : task.status === 'REVIEW' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                    {task.status.replace('_', ' ').charAt(0).toUpperCase() + task.status.replace('_', ' ').slice(1)}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="p-2 text-slate-400 hover:text-primary-400 transition-colors rounded-lg hover:bg-white/5">
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-slate-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-white/5">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-4">{task.title}</h2>
                        <div className="prose prose-invert max-w-none">
                            <p className="text-slate-300 leading-relaxed">{task.description}</p>
                        </div>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
                            <div className="flex items-center gap-3 text-slate-400">
                                <Calendar className="w-5 h-5" />
                                <div>
                                    <p className="text-xs font-semibold text-slate-500">Due Date</p>
                                    <p className="text-sm text-white">{task.dueDate}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400">
                                <Clock className="w-5 h-5" />
                                <div>
                                    <p className="text-xs font-semibold text-slate-500">Created At</p>
                                    <p className="text-sm text-white">{task.createdAt}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* 评论区域 */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card p-8 rounded-3xl"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <MessageSquare className="text-primary-400 w-6 h-6" />
                            <h3 className="text-xl font-bold text-white">Comments ({task.comments})</h3>
                        </div>

                        <div className="space-y-6">
                            {/* 评论输入框 */}
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kyle" alt="Your Avatar" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <textarea 
                                        placeholder="Add a comment..." 
                                        className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/30 resize-none"
                                        rows={3}
                                    ></textarea>
                                    <div className="flex items-center justify-end gap-3 mt-3">
                                        <button className="p-2 text-slate-400 hover:text-white transition-colors">
                                            <Paperclip className="w-4 h-4" />
                                        </button>
                                        <button className="btn-primary">
                                            <Send className="w-4 h-4" />
                                            <span>Comment</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* 评论列表 */}
                            <div className="space-y-6">
                                {[1, 2, 3].map((commentId) => (
                                    <div key={commentId} className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=User${commentId}`} alt="User Avatar" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="bg-white/5 rounded-xl p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-white font-semibold text-sm">Team Member {commentId}</p>
                                                    <p className="text-slate-500 text-xs">2 hours ago</p>
                                                </div>
                                                <p className="text-slate-300 text-sm">这是一条测试评论，用于展示评论功能。</p>
                                            </div>
                                            <div className="flex items-center gap-4 mt-2">
                                                <button className="text-xs text-slate-500 hover:text-primary-400 transition-colors">Reply</button>
                                                <button className="text-xs text-slate-500 hover:text-rose-400 transition-colors">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* 侧边栏 */}
                <div className="space-y-8">
                    {/* 任务信息卡片 */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card p-6 rounded-3xl"
                    >
                        <h3 className="text-lg font-bold text-white mb-6">Task Information</h3>

                        <div className="space-y-6">
                            <div>
                                <p className="text-xs font-semibold text-slate-500 mb-2">Assignees</p>
                                <div className="flex items-center gap-3">
                                    {task.assignees.map((assignee, index) => (
                                        <div key={index} className="relative">
                                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 border-2 border-[#0b0f1a]">
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${assignee}`} alt={assignee} className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                    ))}
                                    <button className="w-10 h-10 rounded-xl bg-white/5 text-slate-400 flex items-center justify-center hover:text-white hover:bg-white/10 transition-colors">
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-semibold text-slate-500 mb-2">Due Date</p>
                                <div className="flex items-center gap-3 text-white">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <span>{task.dueDate}</span>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-semibold text-slate-500 mb-2">Tags</p>
                                <div className="flex flex-wrap gap-2">
                                    {task.tags.map((tag, index) => (
                                        <span key={index} className="px-3 py-1 bg-white/5 rounded-full text-xs text-slate-300 border border-white/10">
                                            {tag}
                                        </span>
                                    ))}
                                    <button className="px-3 py-1 bg-white/5 rounded-full text-xs text-slate-400 border border-dashed border-white/20 hover:text-white hover:border-primary-500/30 transition-colors">
                                        <Plus className="w-3 h-3 inline mr-1" /> Add Tag
                                    </button>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-semibold text-slate-500 mb-2">Attachments</p>
                                <div className="space-y-3">
                                    {[1, 2].map((fileId) => (
                                        <div key={fileId} className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-400">
                                                    <Paperclip className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-white font-medium">file_{fileId}.pdf</p>
                                                    <p className="text-xs text-slate-500">2.4 MB</p>
                                                </div>
                                            </div>
                                            <button className="p-1.5 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                                                <Download className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                    <button className="w-full flex items-center justify-center gap-2 p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                                        <Paperclip className="w-4 h-4" />
                                        <span className="text-sm">Add Attachment</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* 活动日志 */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card p-6 rounded-3xl"
                    >
                        <h3 className="text-lg font-bold text-white mb-6">Activity Log</h3>
                        <div className="space-y-6">
                            {[1, 2, 3, 4].map((logId) => (
                                <div key={logId} className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-400 mt-0.5 flex-shrink-0">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-white font-medium">任务状态更新</p>
                                        <p className="text-xs text-slate-500 mt-1">2 hours ago</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

// 补充缺失的组件
const Send = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="22" x2="11" y1="2" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);

const Download = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" x2="12" y1="15" y2="3"></line>
    </svg>
);

const Plus = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="12" x2="12" y1="5" y2="19"></line>
        <line x1="5" x2="19" y1="12" y2="12"></line>
    </svg>
);