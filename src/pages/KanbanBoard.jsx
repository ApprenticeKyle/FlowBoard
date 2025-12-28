import { motion } from 'framer-motion';
import { Plus, MoreHorizontal } from 'lucide-react';
import BoardCard from '../components/BoardCard';

const columns = [
    {
        id: 'todo',
        title: 'To Do',
        tasks: [
            { id: 1, title: 'Database Schema Design', description: 'Design the core entities for the TaskFlow project including Auth, Task and Project.', priority: 'High', comments: 12, attachments: 3, assignees: ['Alex', 'Jordan'] },
            { id: 4, title: 'API Documentation', description: 'Update Swagger docs for the new DDD endpoints.', priority: 'Medium', comments: 2, attachments: 1, assignees: ['Alex'] },
        ]
    },
    {
        id: 'in-progress',
        title: 'In Progress',
        tasks: [
            { id: 2, title: 'MapStruct Integration', description: 'Replace manual mappers with automated MapStruct interfaces in all modules.', priority: 'Medium', comments: 8, attachments: 5, assignees: ['Kyle', 'Sarah'] },
        ]
    },
    {
        id: 'review',
        title: 'Review',
        tasks: [
            { id: 3, title: 'Frontend Shell', description: 'Create the main layout, sidebar and topbar for FlowBoard.', priority: 'Medium', comments: 5, attachments: 2, assignees: ['Kyle'] },
        ]
    },
    { id: 'done', title: 'Done', tasks: [] },
];

export default function KanbanBoard() {
    return (
        <div className="h-full flex flex-col space-y-8 font-inter">
            <header className="flex items-center justify-between max-w-[1600px] w-full">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Project Board</h1>
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
            </header>

            <div className="flex-1 overflow-x-auto min-h-0 pb-6 custom-scrollbar">
                <div className="flex gap-8 h-full min-w-max">
                    {columns.map((column) => (
                        <div key={column.id} className="w-80 flex flex-col min-h-full">
                            <div className="flex items-center justify-between mb-6 px-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">{column.title}</h3>
                                    <span className="bg-white/5 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/5">
                                        {column.tasks.length}
                                    </span>
                                </div>
                                <button className="text-slate-500 hover:text-white transition-colors">
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex-1 space-y-4 bg-white/[0.02] border border-white/5 rounded-3xl p-4 min-h-[500px]">
                                {column.tasks.map((task) => (
                                    <BoardCard key={task.id} task={task} />
                                ))}

                                <button className="w-full py-4 rounded-2xl border-2 border-dashed border-white/5 text-slate-500 hover:text-primary-400 hover:border-primary-500/30 hover:bg-primary-500/5 transition-all text-xs font-bold flex items-center justify-center gap-2 group">
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
