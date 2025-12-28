import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function MainLayout({ children }) {
    return (
        <div className="flex bg-[#0b0f1a] min-h-screen w-full selection:bg-primary-500/30">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col min-w-0">
                <Topbar />
                <main className="flex-1 p-10 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
