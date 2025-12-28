import { Search, Bell, Plus, HelpCircle } from 'lucide-react';

export default function Topbar() {
    return (
        <header className="topbar-header">
            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-primary-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search tasks, docs, or people..."
                        className="input-search"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="icon-btn">
                    <HelpCircle className="w-5 h-5" />
                </button>
                <button className="icon-btn">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full border-2 border-slate-900"></span>
                </button>

                <div className="w-px h-8 bg-white/5 mx-2" />

                <button className="btn-primary">
                    <Plus className="w-4 h-4" />
                    <span>New Task</span>
                </button>

                <button className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 p-0.5 ml-2 hover:border-primary-500/50 transition-colors">
                    <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kyle"
                        alt="User Avatar"
                        className="w-full h-full rounded-[9px] object-cover bg-slate-800"
                    />
                </button>
            </div>
        </header>
    );
}
