import React, { useState } from 'react';
import { Zap, ArrowRight, Sparkles } from 'lucide-react';
import { quickRefinePrompt } from '../services/gemini';

const QuickRefine: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeTaken, setTimeTaken] = useState<number | null>(null);

  const handleRefine = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    const start = performance.now();
    
    try {
      const refinedText = await quickRefinePrompt(input);
      setOutput(refinedText);
    } finally {
      const end = performance.now();
      setTimeTaken(Math.round(end - start));
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-12 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-amber-500/10 p-2 rounded-lg">
            <Zap className="text-amber-500" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-white">快速润色</h1>
        </div>
        <p className="text-slate-400 max-w-2xl">
          利用 <strong>Gemini 2.5 Flash Lite</strong> 的极速能力，即时修复草稿提示词中的语法、清晰度和语气问题。
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-stretch">
        {/* Input */}
        <div className="flex flex-col space-y-3">
          <label className="text-sm font-medium text-slate-400">草稿提示词</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="在此粘贴您的粗略提示词..."
            className="flex-1 bg-slate-800/50 border border-slate-700 rounded-2xl p-5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none min-h-[300px]"
          />
        </div>

        {/* Actions Mobile Only */}
        <div className="md:hidden flex justify-center">
          <button
            onClick={handleRefine}
            disabled={isLoading}
            className="bg-amber-600 text-white px-6 py-2 rounded-full font-medium flex items-center gap-2"
          >
            {isLoading ? '润色中...' : '润色'} <ArrowRight size={16} />
          </button>
        </div>

        {/* Output */}
        <div className="flex flex-col space-y-3 relative">
          <label className="text-sm font-medium text-slate-400 flex justify-between">
            <span>润色结果</span>
            {timeTaken && (
              <span className="text-xs text-green-400 font-mono flex items-center gap-1">
                <Zap size={12} /> 延迟: {timeTaken}ms
              </span>
            )}
          </label>
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-200 min-h-[300px] relative overflow-hidden">
             {isLoading && (
               <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center z-10 backdrop-blur-sm">
                 <Sparkles className="text-amber-500 animate-spin" size={32} />
               </div>
             )}
             
             {!output && !isLoading ? (
               <div className="h-full flex items-center justify-center text-slate-600 text-sm">
                 结果将显示在这里...
               </div>
             ) : (
               <p className="whitespace-pre-wrap leading-relaxed">{output}</p>
             )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center hidden md:flex">
        <button
          onClick={handleRefine}
          disabled={isLoading || !input.trim()}
          className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-amber-600 px-8 font-medium text-white transition-all duration-300 hover:bg-amber-500 hover:w-56 w-48 disabled:opacity-50 disabled:hover:w-48"
        >
          <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
            <div className="relative h-full w-8 bg-white/20" />
          </div>
          <span className="flex items-center gap-2">
            {isLoading ? '润色中...' : '即时润色'} 
            {!isLoading && <Zap size={18} className="fill-white" />}
          </span>
        </button>
      </div>
    </div>
  );
};

export default QuickRefine;