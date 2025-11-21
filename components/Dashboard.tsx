import React from 'react';
import { View } from '../types';
import { ArrowRight, BrainCircuit, Zap, PenTool, BookOpen } from 'lucide-react';

interface DashboardProps {
  setView: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setView }) => {
  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 h-full overflow-y-auto">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-blue-900/40 to-slate-900 border border-blue-500/20 rounded-3xl p-8 lg:p-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
            掌握 AI 沟通的 <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              艺术
            </span>
          </h1>
          <p className="text-lg text-slate-300 mb-8 leading-relaxed">
            您的全方位提示词撰写工具包。使用我们的构建器搭建结构，通过对话深度学习，并利用快速润色进行即时优化。
          </p>
          <button 
            onClick={() => setView(View.CHAT_TUTOR)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/25 flex items-center gap-2"
          >
            开始学习 <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Card 1: Builder */}
        <div 
          onClick={() => setView(View.PROMPT_BUILDER)}
          className="bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 p-6 rounded-2xl cursor-pointer transition-all hover:bg-slate-800 group"
        >
          <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <PenTool className="text-blue-400" size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">提示词构建器</h3>
          <p className="text-slate-400 text-sm">
            用于创建专业提示词的结构化表单。使用 Gemini 3 Pro 组装完美请求。
          </p>
        </div>

        {/* Card 2: Thinking Chat */}
        <div 
          onClick={() => setView(View.CHAT_TUTOR)}
          className="bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 p-6 rounded-2xl cursor-pointer transition-all hover:bg-slate-800 group"
        >
          <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <BrainCircuit className="text-purple-400" size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">深度思考导师</h3>
          <p className="text-slate-400 text-sm">
            与会思考的 AI 对话。32k token 的思考预算，用于处理复杂推理。
          </p>
        </div>

        {/* Card 3: Quick Refine */}
        <div 
          onClick={() => setView(View.QUICK_REFINE)}
          className="bg-slate-800/50 border border-slate-700 hover:border-amber-500/50 p-6 rounded-2xl cursor-pointer transition-all hover:bg-slate-800 group"
        >
          <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Zap className="text-amber-500" size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">快速润色</h3>
          <p className="text-slate-400 text-sm">
            使用快如闪电的 Gemini Flash Lite 模型即时修复语法和语气。
          </p>
        </div>

        {/* Card 4: Lessons (Optional/Extra row) */}
         <div 
          onClick={() => setView(View.LESSONS)}
          className="bg-slate-800/50 border border-slate-700 hover:border-green-500/50 p-6 rounded-2xl cursor-pointer transition-all hover:bg-slate-800 group md:col-span-3"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="text-green-500" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">学习中心</h3>
              <p className="text-slate-400 text-sm mt-1">
                浏览关于零样本提示 (Zero-shot)、思维链 (Chain-of-Thought) 等的精选课程。
              </p>
            </div>
            <ArrowRight className="ml-auto text-slate-600 group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;