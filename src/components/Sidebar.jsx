import { LayoutDashboard, Kanban, MessageSquare, Settings, Users, FolderKanban, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const menuItems = [
    { icon: LayoutDashboard, labelKey: 'common.dashboard', id: 'dashboard', path: '/dashboard' },
    { icon: FolderKanban, labelKey: 'common.projects', id: 'projects', path: '/projects' },
    { icon: Kanban, labelKey: 'common.tasks', id: 'board', path: '/board' },
    { icon: MessageSquare, labelKey: 'common.chat', id: 'chat', path: '/chat' },
    { icon: Users, labelKey: 'common.team', id: 'team', path: '/team' },
];

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const isActive = (path) => {
        return location.pathname === path;
    };

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
                        className={`nav-item ${isActive(item.path) ? 'text-white bg-white/10 border-l-4 border-primary-500' : ''}`}
                        onClick={() => navigate(item.path)}
                    >
                        <item.icon className={`w-5 h-5 ${isActive(item.path) ? 'text-primary-400' : 'group-hover:text-primary-400'}`} />
                        <span className="font-medium">{t(item.labelKey)}</span>
                    </motion.button>
                ))}
            </nav>

            <div className="p-6 border-t border-white/5 space-y-2">
                <button className="nav-item">
                    <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                    <span className="font-medium">{t('common.settings')}</span>
                </button>
                <button className="w-full flex items-center gap-4 px-4 py-3 text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 rounded-xl transition-all duration-200">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">{t('common.signOut')}</span>
                </button>
            </div>
        </aside>
    );
}
