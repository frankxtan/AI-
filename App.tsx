import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ChatTutor from './components/ChatTutor';
import PromptBuilder from './components/PromptBuilder';
import QuickRefine from './components/QuickRefine';
import Lessons from './components/Lessons';
import { View } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard setView={setCurrentView} />;
      case View.PROMPT_BUILDER:
        return <PromptBuilder />;
      case View.CHAT_TUTOR:
        return <ChatTutor />;
      case View.QUICK_REFINE:
        return <QuickRefine />;
      case View.LESSONS:
        return <Lessons />;
      default:
        return <Dashboard setView={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      <main className="flex-1 h-full overflow-hidden relative">
        {renderView()}
      </main>
    </div>
  );
}