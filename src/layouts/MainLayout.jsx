import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function MainLayout({ children }) {
    return (
        <div className="layout-root">
            <Sidebar />
            <div className="layout-content">
                <Topbar />
                <main className="layout-main">
                    {children}
                </main>
            </div>
        </div>
    );
}
