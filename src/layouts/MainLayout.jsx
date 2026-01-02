import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
    return (
        <div className="layout-root">
            <Sidebar />
            <div className="layout-content">
                <Topbar />
                <main className="layout-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
