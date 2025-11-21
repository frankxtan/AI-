import React, { useState } from 'react';
import { Sliders, CheckCircle, Copy, Wand2 } from 'lucide-react';
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
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await buildStructurePrompt(
        inputs.role,
        inputs.task,
        inputs.context,
        inputs.format,
        inputs.constraints
      );
      setGeneratedPrompt(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
  };

  return (
    <div className="p-6 lg:p-12 max-w-7xl mx-auto h-full overflow-y-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">高级提示词构建器</h1>
        <p className="text-slate-400">定义您的需求核心组件，让 Gemini 3 Pro 为您构建完美的结构化提示词。</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <Sliders size={20} />
              <h3 className="font-semibold uppercase text-sm tracking-wide">配置 (Configuration)</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">角色 / 人设 (Role)</label>
              <input
                type="text"
                name="role"
                value={inputs.role}
                onChange={handleInputChange}
                placeholder="例如：资深 Python 工程师、营销大师"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">任务 (Task)</label>
              <textarea
                name="task"
                value={inputs.task}
                onChange={handleInputChange}
                placeholder="AI 需要做什么？例如：写一个脚本来解析 CSV..."
                rows={2}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">背景 (Context)</label>
              <textarea
                name="context"
                value={inputs.context}
                onChange={handleInputChange}
                placeholder="背景信息... 例如：受众是初学者..."
                rows={3}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">输出格式 (Output Format)</label>
                <input
                  type="text"
                  name="format"
                  value={inputs.format}
                  onChange={handleInputChange}
                  placeholder="例如：JSON、Markdown 表格"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">约束条件 (Constraints)</label>
                <input
                  type="text"
                  name="constraints"
                  value={inputs.constraints}
                  onChange={handleInputChange}
                  placeholder="例如：不超过 200 字"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <span className="animate-pulse">组装提示词中...</span>
              ) : (
                <>
                  <Wand2 size={20} />
                  生成完美提示词
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="flex flex-col h-full">
          <div className={`flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-1 relative overflow-hidden group ${generatedPrompt ? 'ring-2 ring-blue-500/20' : ''}`}>
            {!generatedPrompt && !isGenerating && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                <Sliders size={48} className="mb-4 opacity-20" />
                <p>您优化后的提示词将显示在这里。</p>
              </div>
            )}
            
            <div className="h-full w-full bg-slate-950 rounded-xl p-6 overflow-y-auto font-mono text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
              {generatedPrompt}
            </div>

            {generatedPrompt && (
              <button
                onClick={copyToClipboard}
                className="absolute top-4 right-4 p-2 bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                title="复制到剪贴板"
              >
                <Copy size={18} />
              </button>
            )}
          </div>
          
          {generatedPrompt && (
            <div className="mt-4 flex items-start gap-3 p-4 bg-green-900/20 border border-green-500/20 rounded-xl">
              <CheckCircle className="text-green-500 shrink-0" size={20} />
              <div>
                <h4 className="text-green-400 font-medium text-sm">准备就绪</h4>
                <p className="text-green-500/70 text-xs mt-1">
                  将其复制到任何 LLM 中。该结构针对清晰度和减少幻觉进行了优化。
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