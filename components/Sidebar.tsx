import React from 'react';
import { LayoutDashboard, PenTool, MessageSquare, Zap, BookOpen, Eye, Hexagon } from 'lucide-react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: View.DASHBOARD, label: '首页', icon: <LayoutDashboard size={20} /> },
    { id: View.PROMPT_BUILDER, label: '构建器', icon: <PenTool size={20} /> },
    { id: View.MULTIMODAL, label: '多模态', icon: <Eye size={20} /> },
    { id: View.CHAT_TUTOR, label: 'AI 导师', icon: <MessageSquare size={20} /> },
    { id: View.QUICK_REFINE, label: '快速润色', icon: <Zap size={20} /> },
    { id: View.LESSONS, label: '学习中心', icon: <BookOpen size={20} /> },
  ];

  return (
    <div className="h-full w-20 lg:w-72 bg-slate-900/60 backdrop-blur-xl border-r border-slate-800/50 flex flex-col transition-all duration-300 relative z-50">
      {/* Brand */}
      <div className="h-20 flex items-center justify-center lg:justify-start px-6 border-b border-slate-800/50">
        <div className="relative group">
          <div className="absolute inset-0 bg-blue-500 rounded-lg blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
          <div className="relative bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-inner">
            <Hexagon className="text-white fill-white/20" size={22} />
          </div>
        </div>
        <h1 className="ml-4 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 hidden lg:block tracking-tight">
          PromptMaster
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-8 px-3 lg:px-4 space-y-1.5 overflow-y-auto scrollbar-hide">
        <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 hidden lg:block">
          Menu
        </p>
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                isActive
                  ? 'bg-blue-600/10 text-blue-400'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              )}
              
              <span className={`relative z-10 transition-transform duration-200 ${isActive ? 'translate-x-1' : 'group-hover:scale-110'}`}>
                {item.icon}
              </span>
              
              <span className={`ml-3 font-medium text-sm hidden lg:block relative z-10 transition-transform duration-200 ${isActive ? 'translate-x-1' : ''}`}>
                {item.label}
              </span>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
            </button>
          );
        })}
      </nav>

      {/* Footer / Status */}
      <div className="p-4 border-t border-slate-800/50 bg-slate-900/30 backdrop-blur-sm hidden lg:block">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-slate-700/50 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full blur-xl -mr-6 -mt-6"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Model Status</span>
            <div className="flex items-center space-x-1.5 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] font-bold text-green-400 uppercase">Online</span>
            </div>
          </div>
          <p className="text-xs text-slate-300 font-semibold truncate">Gemini 3 Pro Ready</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;