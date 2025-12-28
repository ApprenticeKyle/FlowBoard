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

    const tasks = project?.tasks || [];
    const columns = [
        { id: 'todo', title: 'To Do', tasks: tasks.filter(t => t.status === 'TODO') },
        { id: 'in-progress', title: 'In Progress', tasks: tasks.filter(t => t.status === 'IN_PROGRESS') },
        { id: 'review', title: 'Review', tasks: tasks.filter(t => t.status === 'REVIEW') },
        { id: 'done', title: 'Done', tasks: tasks.filter(t => t.status === 'DONE') },
    ];

    return (
        <div className="h-full flex flex-col space-y-8 font-inter">
            <header className="flex items-center justify-between max-w-[1600px] w-full">
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
            </header>

            <div className="flex-1 overflow-x-auto min-h-0 pb-6 custom-scrollbar">
                <div className="flex gap-8 h-full min-w-max">
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
