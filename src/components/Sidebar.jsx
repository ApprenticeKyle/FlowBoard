import { LayoutDashboard, Kanban, MessageSquare, Settings, Users, FolderKanban, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
    { icon: FolderKanban, label: 'Projects', id: 'projects' },
    { icon: Kanban, label: 'Board', id: 'board' },
    { icon: MessageSquare, label: 'Chat', id: 'chat' },
    { icon: Users, label: 'Team', id: 'team' },
];

export default function Sidebar() {
    return (
        <aside className="nav-aside">
            <div className="p-8 pb-12 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                    <Kanban className="text-white w-6 h-6" />
                </div>
                <span className="text-white font-bold text-xl tracking-tight">FlowBoard</span>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => (
                    <motion.button
                        key={item.id}
                        whileHover={{ x: 4 }}
                        className="nav-item"
                    >
                        <item.icon className="w-5 h-5 group-hover:text-primary-400" />
                        <span className="font-medium">{item.label}</span>
                    </motion.button>
                ))}
            </nav>

            <div className="p-6 border-t border-white/5 space-y-2">
                <button className="nav-item">
                    <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                    <span className="font-medium">Settings</span>
                </button>
                <button className="w-full flex items-center gap-4 px-4 py-3 text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 rounded-xl transition-all duration-200">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
