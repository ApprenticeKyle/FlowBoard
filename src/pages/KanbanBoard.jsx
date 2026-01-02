import { useState, useEffect } from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';
import BoardCard from '../components/BoardCard';
import { api } from '../utils/api';

export default function KanbanBoard() {
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                // Assuming project ID 1 for now
                const data = await api.get('/projects/1/details');
                setProject(data);
            } catch (error) {
                console.error('Failed to fetch project details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjectDetails();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-white text-xl font-bold animate-pulse">Loading Board...</div>
            </div>
        );
    }

    // 添加模拟数据，确保页面有内容显示
    const mockTasks = [
        { id: 1, title: '实现看板拖拽功能', description: '为任务卡片添加拖拽功能', status: 'IN_PROGRESS', priority: 'High', assignees: ['Alex', 'Kyle'], comments: 3, attachments: 1 },
        { id: 2, title: '设计新的UI组件', description: '设计并实现新的按钮和表单组件', status: 'TODO', priority: 'Medium', assignees: ['Sarah'], comments: 1, attachments: 0 },
        { id: 3, title: '优化API响应速度', description: '优化后端API性能，减少响应时间', status: 'REVIEW', priority: 'High', assignees: ['Jordan'], comments: 5, attachments: 2 },
        { id: 4, title: '添加用户权限管理', description: '实现基于角色的权限控制', status: 'DONE', priority: 'Medium', assignees: ['Alex'], comments: 2, attachments: 0 },
    ];
    
    // 使用模拟数据，实际项目中替换为API返回数据
    const tasks = mockTasks;
    const columns = [
        { id: 'todo', title: 'To Do', tasks: tasks.filter(t => t.status === 'TODO') },
        { id: 'in-progress', title: 'In Progress', tasks: tasks.filter(t => t.status === 'IN_PROGRESS') },
        { id: 'review', title: 'Review', tasks: tasks.filter(t => t.status === 'REVIEW') },
        { id: 'done', title: 'Done', tasks: tasks.filter(t => t.status === 'DONE') },
    ];

    return (
        <div className="h-full flex flex-col space-y-8 font-inter">
            {/* 保持header居中对齐 */}
            <header className="max-w-[1600px] w-full mx-auto px-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">{project?.name || 'Project Board'}</h1>
                        <p className="text-slate-400 font-medium">TaskFlow / Sprint 1</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-3 mr-4">
                            {['Alex', 'Sarah', 'Jordan', 'Kyle'].map((m) => (
                                <div key={m} className="w-10 h-10 rounded-xl border-4 border-[#0b0f1a] overflow-hidden bg-slate-800 shadow-xl">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m}`} alt="member" className="w-full h-full object-cover" />
                                </div>
                            ))}
                            <button className="w-10 h-10 rounded-xl border-4 border-[#0b0f1a] bg-slate-800 text-white flex items-center justify-center text-xs font-bold hover:bg-slate-700 transition-colors shadow-xl">
                                +12
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* 看板内容区域：从左侧开始，允许横向滚动 */}
            <div className="flex-1 overflow-x-auto min-h-0 pb-6 custom-scrollbar px-10">
                <div className="flex gap-8 h-full">
                    {columns.map((column) => (
                        <div key={column.id} className="board-column">
                            <div className="flex items-center justify-between mb-6 px-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">{column.title}</h3>
                                    <span className="badge-priority bg-white/5 text-slate-500 border border-white/5">
                                        {column.tasks.length}
                                    </span>
                                </div>
                                <button className="text-slate-500 hover:text-white transition-colors">
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="column-body">
                                {column.tasks.map((task) => (
                                    <BoardCard key={task.id} task={task} />
                                ))}

                                <button className="btn-add-task group">
                                    <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    Add Task
                                </button>
                            </div>
                        </div>
                    ))}

                    <button className="w-80 h-12 flex items-center justify-center gap-2 text-slate-500 hover:text-white transition-colors border border-dashed border-white/5 rounded-3xl font-bold text-sm bg-white/[0.01] hover:bg-white/[0.03]">
                        <Plus className="w-4 h-4" />
                        Add Column
                    </button>
                </div>
            </div>
        </div>
    );
}
