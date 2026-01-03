import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
    return (
        <div className="layout-root">
            {/* 固定侧边栏 */}
            <Sidebar />
            
            {/* 右侧内容区域 */}
            <div className="layout-content">
                {/* 固定顶部栏 */}
                <Topbar />
                
                {/* 可滚动的内容区域 */}
                <main className="layout-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
