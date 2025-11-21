import React from 'react';
import { LayoutDashboard, PenTool, MessageSquare, Zap, BookOpen } from 'lucide-react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: View.DASHBOARD, label: '首页', icon: <LayoutDashboard size={20} /> },
    { id: View.PROMPT_BUILDER, label: '提示词构建器', icon: <PenTool size={20} /> },
    { id: View.CHAT_TUTOR, label: 'AI 导师对话', icon: <MessageSquare size={20} /> },
    { id: View.QUICK_REFINE, label: '快速润色', icon: <Zap size={20} /> },
    { id: View.LESSONS, label: '学习中心', icon: <BookOpen size={20} /> },
  ];

  return (
    <div className="w-20 lg:w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full transition-all duration-300">
      <div className="p-6 flex items-center justify-center lg:justify-start border-b border-slate-800">
        <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
          <Zap className="text-white" size={24} />
        </div>
        <h1 className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 hidden lg:block">
          PromptMaster
        </h1>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group ${
              currentView === item.id
                ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <span className={`${currentView === item.id ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'}`}>
              {item.icon}
            </span>
            <span className="ml-3 font-medium hidden lg:block">{item.label}</span>
            {currentView === item.id && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 hidden lg:block animate-pulse" />
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 hidden lg:block">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <p className="text-xs text-slate-400 mb-2">技术支持</p>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-semibold text-slate-200">Gemini 3 Pro</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;