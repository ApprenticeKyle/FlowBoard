import { Search, Bell, Plus, HelpCircle, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Topbar() {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <header className="topbar-header">
            <div className="max-w-[1600px] w-full mx-auto flex items-center justify-between px-10">
                <div className="relative group max-w-xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-primary-400 transition-colors" />
                    <input
                        type="text"
                        placeholder={t('common.search')}
                        className="input-search"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <button className="icon-btn">
                        <HelpCircle className="w-5 h-5" />
                    </button>
                    <button className="icon-btn">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full border-2 border-slate-900"></span>
                    </button>

                    {/* 语言切换按钮 */}
                    <div className="relative group">
                        <button className="icon-btn">
                            <Globe className="w-5 h-5" />
                        </button>
                        <div className="absolute right-0 top-full mt-2 w-28 bg-slate-900 rounded-xl shadow-2xl border border-white/10 hidden group-hover:block z-50">
                            <button 
                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${i18n.language === 'zh' ? 'text-primary-400 bg-primary-500/10' : 'text-slate-300 hover:text-white'}`}
                                onClick={() => changeLanguage('zh')}
                            >
                                中文
                            </button>
                            <button 
                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${i18n.language === 'en' ? 'text-primary-400 bg-primary-500/10' : 'text-slate-300 hover:text-white'}`}
                                onClick={() => changeLanguage('en')}
                            >
                                English
                            </button>
                        </div>
                    </div>

                    <div className="w-px h-8 bg-white/5 mx-2" />

                    <button className="btn-primary">
                        <Plus className="w-4 h-4" />
                        <span>{t('common.newTask')}</span>
                    </button>

                    <button className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 p-0.5 ml-2 hover:border-primary-500/50 transition-colors">
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kyle"
                            alt="User Avatar"
                            className="w-full h-full rounded-[9px] object-cover bg-slate-800"
                        />
                    </button>
                </div>
            </div>
        </header>
    );
}
