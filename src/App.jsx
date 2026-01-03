import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import KanbanBoard from './pages/KanbanBoard';
import Projects from '@features/projects/pages/Projects';
import ProjectDetail from '@features/projects/pages/ProjectDetail';
import Team from './pages/Team';
import Chat from './pages/Chat';
import TaskDetail from './pages/TaskDetail';
import { GlobalToast } from '@shared/components/GlobalToast';
import { GlobalConfirmDialog } from '@shared/components/GlobalConfirmDialog';

// 包装Sidebar以支持路由
function LayoutWrapper({ children }) {
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LayoutWrapper />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="board" element={<KanbanBoard />} />
          <Route path="chat" element={<Chat />} />
          <Route path="team" element={<Team />} />
          <Route path="tasks/:id" element={<TaskDetail />} />
        </Route>
      </Routes>
      <GlobalToast />
      <GlobalConfirmDialog />
    </BrowserRouter>
  );
}

export default App;
