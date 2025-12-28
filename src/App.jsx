import { useState } from 'react';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import KanbanBoard from './pages/KanbanBoard';

function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'board':
        return <KanbanBoard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <MainLayout>
      {renderPage()}

      {/* Simulation for switching pages since we don't have a router yet */}
      <div className="nav-simulator">
        <button
          onClick={() => setActivePage('dashboard')}
          className={`simulator-btn ${activePage === 'dashboard' ? 'simulator-btn-active' : 'simulator-btn-inactive'}`}
        >
          View Dashboard
        </button>
        <button
          onClick={() => setActivePage('board')}
          className={`simulator-btn ${activePage === 'board' ? 'simulator-btn-active' : 'simulator-btn-inactive'}`}
        >
          View Kanban Board
        </button>
      </div>
    </MainLayout>
  );
}

export default App;
