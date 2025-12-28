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
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 glass px-6 py-4 rounded-3xl z-[100] border border-white/10 shadow-2xl">
        <button
          onClick={() => setActivePage('dashboard')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activePage === 'dashboard' ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'text-slate-400 hover:text-white'}`}
        >
          View Dashboard
        </button>
        <button
          onClick={() => setActivePage('board')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activePage === 'board' ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'text-slate-400 hover:text-white'}`}
        >
          View Kanban Board
        </button>
      </div>
    </MainLayout>
  );
}

export default App;
