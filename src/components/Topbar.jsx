import { Search, Bell, Plus, HelpCircle } from 'lucide-react';

export default function Topbar() {
    return (
        <header className="h-20 glass border-b border-white/5 flex items-center justify-between px-10 sticky top-0 z-40">
            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-primary-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search tasks, docs, or people..."
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-2.5 pl-12 pr-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/30 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 text-slate-400 hover:text-white transition-colors">
                    <HelpCircle className="w-5 h-5" />
                </button>
                <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full border-2 border-slate-900"></span>
                </button>

                <div className="w-px h-8 bg-white/5 mx-2" />

                <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-semibold shadow-lg shadow-primary-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0">
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
