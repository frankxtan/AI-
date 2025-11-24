import React, { useState } from 'react';
import { Sliders, CheckCircle, Copy, Wand2, Lightbulb, Box } from 'lucide-react';
import { buildStructurePrompt } from '../services/gemini';
import { PromptInputs } from '../types';

const PromptBuilder: React.FC = () => {
  const [inputs, setInputs] = useState<PromptInputs>({
    role: '',
    task: '',
    context: '',
    format: '',
    constraints: ''
  });
  const [result, setResult] = useState<{ strategy: string; prompt: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setResult(null);
    try {
      const rawText = await buildStructurePrompt(
        inputs.role,
        inputs.task,
        inputs.context,
        inputs.format,
        inputs.constraints
      );

      // Parse the response based on the "---SEPARATOR---" delimiter defined in the service
      const parts = rawText.split("---SEPARATOR---");
      if (parts.length >= 2) {
        setResult({
          strategy: parts[0].trim(),
          prompt: parts[1].trim()
        });
      } else {
        // Fallback if separator is missing
        setResult({
          strategy: "AI 直接生成了结果，未提供架构笔记。",
          prompt: rawText.trim()
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (result?.prompt) {
      navigator.clipboard.writeText(result.prompt);
    }
  };

  return (
    <div className="p-6 lg:p-12 max-w-7xl mx-auto h-full overflow-y-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          高级提示词构建器 
          <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded border border-purple-500/30">Powered by Gemini 3.0 Logic</span>
        </h1>
        <p className="text-slate-400">
          这不仅是填空题。Gemini 3.0 会像一位能够进行<strong>深度推理的架构师</strong>一样，分析您的意图，自动补全缺失的约束，并生成防御性指令。
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <Sliders size={20} />
              <h3 className="font-semibold uppercase text-sm tracking-wide">配置参数 (Input)</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">角色 / 人设 (Role)</label>
              <input
                type="text"
                name="role"
                value={inputs.role}
                onChange={handleInputChange}
                placeholder="留空则由 AI 自动推断最佳专家角色"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">核心任务 (Task) <span className="text-red-400">*</span></label>
              <textarea
                name="task"
                value={inputs.task}
                onChange={handleInputChange}
                placeholder="AI 需要做什么？例如：分析这份销售数据并找出异常点..."
                rows={3}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">背景信息 (Context)</label>
              <textarea
                name="context"
                value={inputs.context}
                onChange={handleInputChange}
                placeholder="例如：这是给非技术人员看的报告，数据来源是 Q3 季度..."
                rows={2}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">输出格式</label>
                <input
                  type="text"
                  name="format"
                  value={inputs.format}
                  onChange={handleInputChange}
                  placeholder="JSON, Markdown 表格..."
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">约束条件</label>
                <input
                  type="text"
                  name="constraints"
                  value={inputs.constraints}
                  onChange={handleInputChange}
                  placeholder="例如：简洁、无废话..."
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !inputs.task.trim()}
              className="w-full mt-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                   <Wand2 size={20} className="animate-spin" /> 正在进行意图推理...
                </span>
              ) : (
                <>
                  <Wand2 size={20} className="group-hover:rotate-12 transition-transform" />
                  生成架构级提示词
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="flex flex-col h-full space-y-4">
          
          {/* Strategy Card - Only shows when result exists */}
          {result && (
            <div className="bg-purple-900/10 border border-purple-500/30 rounded-xl p-5 animate-fade-in">
              <div className="flex items-center gap-2 text-purple-400 mb-2">
                <Lightbulb size={18} />
                <h4 className="font-semibold text-sm uppercase tracking-wide">架构师笔记 (Strategy)</h4>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                {result.strategy}
              </p>
            </div>
          )}

          {/* Prompt Card */}
          <div className={`flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-1 relative overflow-hidden group min-h-[400px] flex flex-col ${result ? 'ring-2 ring-blue-500/20' : ''}`}>
            {!result && !isGenerating && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 p-8 text-center">
                <Box size={48} className="mb-4 opacity-20" />
                <p className="text-lg font-medium mb-2">等待任务输入...</p>
                <p className="text-sm opacity-70">
                  输入您的粗略想法，Gemini 3.0 将为您自动构建包含<br/>
                  <span className="text-blue-500">思维链</span>、<span className="text-blue-500">角色锚定</span>和<span className="text-blue-500">防御机制</span>的完整提示词。
                </p>
              </div>
            )}
            
            {result && (
               <div className="h-full w-full bg-slate-950 rounded-xl p-6 overflow-y-auto font-mono text-sm text-slate-300 leading-relaxed whitespace-pre-wrap scrollbar-thin">
                 {result.prompt}
               </div>
            )}

            {result && (
              <button
                onClick={copyToClipboard}
                className="absolute top-4 right-4 p-2 bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all opacity-0 group-hover:opacity-100 shadow-lg border border-slate-700"
                title="复制到剪贴板"
              >
                <Copy size={18} />
              </button>
            )}
          </div>
          
          {result && (
            <div className="flex items-start gap-3 p-4 bg-green-900/20 border border-green-500/20 rounded-xl">
              <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="text-green-400 font-medium text-sm">已针对 LLM 逻辑优化</h4>
                <p className="text-green-500/70 text-xs mt-1">
                  该提示词已包含隐式思维引导，可直接用于 Gemini Pro、GPT-4 或 Claude 3.5 Sonnet。
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptBuilder;