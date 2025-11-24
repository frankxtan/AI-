import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ChatTutor from './components/ChatTutor';
import PromptBuilder from './components/PromptBuilder';
import QuickRefine from './components/QuickRefine';
import Lessons from './components/Lessons';
import MultimodalLab from './components/MultimodalLab';
import { View } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard setView={setCurrentView} />;
      case View.PROMPT_BUILDER:
        return <PromptBuilder />;
      case View.MULTIMODAL:
        return <MultimodalLab />;
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
    <div className="flex h-screen w-full overflow-hidden text-slate-100 font-sans selection:bg-blue-500/30">
      {/* Sidebar - Fixed/Floating feel */}
      <div className="z-50 shrink-0">
        <Sidebar currentView={currentView} setView={setCurrentView} />
      </div>

      {/* Main Content - Scrollable Area */}
      <main className="flex-1 h-full relative overflow-hidden bg-slate-950/30 backdrop-blur-[2px]">
        {/* Content Container */}
        <div className="h-full w-full overflow-y-auto overflow-x-hidden scrollbar-thin">
          {renderView()}
        </div>
      </main>
    </div>
  );
}