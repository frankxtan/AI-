import React from 'react';
import { View } from '../types';
import { ArrowRight, BrainCircuit, Zap, PenTool, BookOpen, Eye, Sparkles } from 'lucide-react';

interface DashboardProps {
  setView: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setView }) => {
  return (
    <div className="p-6 lg:p-12 max-w-[1400px] mx-auto space-y-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in-up">
        <div>
          <h2 className="text-slate-400 font-medium mb-1">Welcome back</h2>
          <h1 className="text-3xl font-bold text-white">PromptMaster Workspace</h1>
        </div>
        <div className="text-right hidden md:block">
           <p className="text-sm text-slate-500 font-mono">v3.0.0 (Gemini Powered)</p>
        </div>
      </header>

      {/* Hero Card */}
      <div className="relative group overflow-hidden rounded-3xl border border-blue-500/30 shadow-2xl shadow-blue-900/20 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-slate-900 to-slate-950 z-0"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] -mr-20 -mt-20 group-hover:bg-blue-500/30 transition-colors duration-700"></div>
        
        <div className="relative z-10 p-8 lg:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wide">
              <Sparkles size={12} /> 全新升级
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
              掌握 AI 沟通的 <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                终极艺术
              </span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed max-w-lg">
              不仅仅是工具，更是思维的延伸。利用 Gemini 3.0 的深度推理、视觉感知与逻辑构建能力，打造完美的提示词工程。
            </p>
            <div className="flex gap-4 pt-2">
              <button 
                onClick={() => setView(View.CHAT_TUTOR)}
                className="bg-white text-slate-900 hover:bg-blue-50 px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-white/10 flex items-center gap-2 transform hover:-translate-y-1"
              >
                开始对话 <ArrowRight size={18} />
              </button>
              <button 
                onClick={() => setView(View.PROMPT_BUILDER)}
                className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-200 border border-blue-500/30 px-8 py-3.5 rounded-xl font-semibold transition-all backdrop-blur-sm"
              >
                构建提示词
              </button>
            </div>
          </div>
          
          {/* Decorative Illustration */}
          <div className="hidden md:block relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full animate-pulse"></div>
            <BrainCircuit size={200} className="text-blue-500/50 relative z-10 drop-shadow-2xl" strokeWidth={0.5} />
          </div>
        </div>
      </div>

      {/* Bento Grid Features */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
          核心工具
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card: Builder */}
          <div 
            onClick={() => setView(View.PROMPT_BUILDER)}
            className="group relative bg-slate-800/40 backdrop-blur-md border border-slate-700/50 hover:border-blue-500/50 p-8 rounded-3xl cursor-pointer transition-all hover:bg-slate-800/60 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/10 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <PenTool className="text-blue-400" size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">提示词构建器</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              像架构师一样思考。使用结构化表单和 Gemini 3 Pro 自动推演，构建无懈可击的 Prompt。
            </p>
          </div>

          {/* Card: Multimodal */}
          <div 
            onClick={() => setView(View.MULTIMODAL)}
            className="group relative bg-slate-800/40 backdrop-blur-md border border-slate-700/50 hover:border-purple-500/50 p-8 rounded-3xl cursor-pointer transition-all hover:bg-slate-800/60 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-900/10 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-14 h-14 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Eye className="text-purple-400" size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">多模态实验室</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              打破文本界限。利用 AI 的视觉感知能力分析图像，或描述想象以生成画面。
            </p>
          </div>

          {/* Card: Quick Refine */}
          <div 
            onClick={() => setView(View.QUICK_REFINE)}
            className="group relative bg-slate-800/40 backdrop-blur-md border border-slate-700/50 hover:border-amber-500/50 p-8 rounded-3xl cursor-pointer transition-all hover:bg-slate-800/60 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-900/10 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Zap className="text-amber-500" size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">快速润色</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              毫秒级响应。利用 Gemini Flash Lite 的极速能力，即时修复语法、语气和清晰度。
            </p>
          </div>

          {/* Card: Chat Tutor (Wide) */}
          <div 
            onClick={() => setView(View.CHAT_TUTOR)}
            className="group relative md:col-span-2 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 hover:border-indigo-500/50 p-8 rounded-3xl cursor-pointer transition-all hover:bg-slate-800/60 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-900/10 overflow-hidden flex items-center justify-between"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="max-w-lg relative z-10">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center">
                    <BrainCircuit className="text-indigo-400" size={20} />
                 </div>
                 <h3 className="text-xl font-bold text-white">深度思考导师</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                启用 Gemini 3 Pro 的 <strong>Thinking Mode</strong>。拥有 32k 的思维预算，可以处理最复杂的逻辑推理和教学任务。
              </p>
            </div>
            <div className="hidden lg:block relative z-10">
               <div className="bg-indigo-600/20 p-3 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-all text-indigo-400">
                 <ArrowRight size={24} />
               </div>
            </div>
          </div>

          {/* Card: Learning (Small) */}
          <div 
            onClick={() => setView(View.LESSONS)}
            className="group relative bg-slate-800/40 backdrop-blur-md border border-slate-700/50 hover:border-green-500/50 p-8 rounded-3xl cursor-pointer transition-all hover:bg-slate-800/60 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-900/10 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-14 h-14 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="text-green-500" size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">进阶课程</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              从 Zero-shot 到上下文工程，11 节核心课程助你进阶。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;