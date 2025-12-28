import { motion } from 'framer-motion';
import { MoreHorizontal, Paperclip, MessageSquare } from 'lucide-react';

export default function BoardCard({ task }) {
    const priorityColors = {
        High: 'bg-rose-500/10 text-rose-400',
        Medium: 'bg-amber-500/10 text-amber-400',
        Low: 'bg-emerald-500/10 text-emerald-400',
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="glass-card p-5 rounded-2xl cursor-grab active:cursor-grabbing group border border-white/5 hover:border-primary-500/30 transition-all font-inter"
        >
            <div className="flex items-start justify-between mb-4">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${priorityColors[task.priority]}`}>
                    {task.priority}
                </span>
                <button className="text-slate-500 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>

            <h4 className="text-white font-semibold text-sm leading-snug mb-2 group-hover:text-primary-300 transition-colors">
                {task.title}
            </h4>
            <p className="text-slate-500 text-xs line-clamp-2 mb-4 leading-relaxed font-medium">
                {task.description}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-slate-500">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold">{task.comments}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                        <Paperclip className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold">{task.attachments}</span>
                    </div>
                </div>

                <div className="flex -space-x-2">
                    {task.assignees.map((a, i) => (
                        <div key={i} className="w-6 h-6 rounded-lg border-2 border-slate-900 overflow-hidden bg-slate-800 shadow-sm">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${a}`} alt="member" className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
