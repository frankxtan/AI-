import React, { useState } from 'react';
import { Sliders, CheckCircle, Copy, Wand2, Lightbulb, Box, Play, Terminal, ArrowDown, Sparkles } from 'lucide-react';
import { buildStructurePrompt, executePrompt } from '../services/gemini';
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
  const [testInput, setTestInput] = useState('');
  const [testResult, setTestResult] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setResult(null);
    setTestResult('');
    try {
      const rawText = await buildStructurePrompt(
        inputs.role,
        inputs.task,
        inputs.context,
        inputs.format,
        inputs.constraints
      );
      const parts = rawText.split("---SEPARATOR---");
      if (parts.length >= 2) {
        setResult({ strategy: parts[0].trim(), prompt: parts[1].trim() });
      } else {
        setResult({ strategy: "AI 直接生成了结果，未提供架构笔记。", prompt: rawText.trim() });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTestRun = async () => {
    if (!result?.prompt) return;
    setIsTesting(true);
    setTestResult('');
    try {
      const output = await executePrompt(result.prompt, testInput);
      setTestResult(output);
    } catch (error) {
      setTestResult("执行出错，请重试。");
    } finally {
      setIsTesting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    if (text) navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col lg:flex-row lg:h-full lg:overflow-hidden">
      {/* LEFT: Input Config */}
      <div className="w-full lg:w-1/2 h-auto lg:h-full lg:overflow-y-auto p-6 lg:p-10 border-r border-slate-800/50 bg-slate-900/40 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-3 flex items-center gap-3">
              提示词构建器 
            </h1>
            <p className="text-slate-400 leading-relaxed">
              利用 <span className="text-blue-400 font-semibold">Gemini 3.0</span> 的推理能力，将简单的意图转化为包含思维链、防御机制的专业 Prompt。
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Sliders size={16} /> 核心参数
              </h3>
              
              <div className="space-y-5">
                <div className="group">
                  <label className="block text-sm font-medium text-slate-300 mb-2 group-focus-within:text-blue-400 transition-colors">角色 / 人设 (Role)</label>
                  <input
                    type="text"
                    name="role"
                    value={inputs.role}
                    onChange={handleInputChange}
                    placeholder="例如：资深 Python 后端工程师..."
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder-slate-600 hover:border-slate-700"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-slate-300 mb-2 group-focus-within:text-blue-400 transition-colors">核心任务 (Task) <span className="text-red-400">*</span></label>
                  <textarea
                    name="task"
                    value={inputs.task}
                    onChange={handleInputChange}
                    placeholder="详细描述 AI 需要完成的工作..."
                    rows={4}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none hover:border-slate-700"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-slate-300 mb-2 group-focus-within:text-blue-400 transition-colors">背景信息 (Context)</label>
                  <textarea
                    name="context"
                    value={inputs.context}
                    onChange={handleInputChange}
                    placeholder="提供必要的背景知识..."
                    rows={3}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none hover:border-slate-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-sm font-medium text-slate-300 mb-2 group-focus-within:text-blue-400 transition-colors">输出格式</label>
                    <input
                      type="text"
                      name="format"
                      value={inputs.format}
                      onChange={handleInputChange}
                      placeholder="JSON, 表格..."
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all hover:border-slate-700"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-medium text-slate-300 mb-2 group-focus-within:text-blue-400 transition-colors">约束条件</label>
                    <input
                      type="text"
                      name="constraints"
                      value={inputs.constraints}
                      onChange={handleInputChange}
                      placeholder="简洁, 无废话..."
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all hover:border-slate-700"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 pb-10">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !inputs.task.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group border border-white/10"
              >
                {isGenerating ? (
                  <>
                    <Wand2 size={20} className="animate-spin" />
                    <span className="animate-pulse">正在进行意图推理...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={20} className="group-hover:scale-110 transition-transform" />
                    生成架构级提示词
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Output & Playground */}
      <div className="w-full lg:w-1/2 h-auto lg:h-full lg:overflow-y-auto bg-slate-950/60 backdrop-blur-md p-6 lg:p-10 border-t lg:border-t-0 lg:border-l border-slate-800/50">
        <div className="max-w-2xl mx-auto h-full flex flex-col">
          {!result && !isGenerating ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 p-8 text-center opacity-60 min-h-[300px]">
              <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mb-6 border border-slate-800">
                <Box size={40} className="text-slate-700" />
              </div>
              <p className="text-xl font-semibold mb-2 text-slate-500">等待任务输入</p>
              <p className="text-sm max-w-sm">
                输入您的粗略想法，AI 将自动补全角色、防御机制和思维链结构。
              </p>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in pb-10">
              
              {/* Strategy Card */}
              {result && (
                <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-2xl p-6">
                  <div className="flex items-center gap-2 text-indigo-300 mb-3">
                    <Lightbulb size={18} />
                    <h4 className="font-bold text-xs uppercase tracking-wide">架构师笔记 (Strategy)</h4>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {result.strategy}
                  </p>
                </div>
              )}

              {/* Prompt Editor */}
              <div className="flex-1 flex flex-col space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">最终提示词 (Final Prompt)</label>
                  <button onClick={() => copyToClipboard(result?.prompt || '')} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                    <Copy size={12} /> 复制
                  </button>
                </div>
                <div className="relative group bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden min-h-[300px]">
                   <textarea
                     value={result?.prompt || ''}
                     onChange={(e) => result && setResult({...result, prompt: e.target.value})}
                     className="w-full h-full bg-transparent p-6 font-mono text-sm text-slate-300 leading-relaxed resize-none focus:outline-none min-h-[300px]"
                     placeholder="Prompt..."
                   />
                </div>
              </div>

              {/* Playground */}
              <div className="mt-8 border-t border-slate-800 pt-8">
                 <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                       <Terminal size={18} className="text-green-500" />
                       <h3 className="text-lg font-bold text-white">即时演练场</h3>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 px-2 py-1 bg-slate-900 rounded border border-slate-800">GEMINI_PRO_ENV</span>
                 </div>
                 
                 <div className="space-y-4">
                    <textarea 
                       value={testInput}
                       onChange={(e) => setTestInput(e.target.value)}
                       placeholder="[可选] 在此粘贴测试数据（如文章、代码片段）。它将作为变量附加在提示词后。"
                       className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-sm text-slate-300 focus:outline-none focus:border-green-500/30 transition-all h-24 resize-none"
                    />
                    
                    <div className="flex justify-end">
                       <button 
                         onClick={handleTestRun}
                         disabled={isTesting}
                         className="bg-green-600/90 hover:bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-lg shadow-green-900/20 disabled:opacity-50"
                       >
                         {isTesting ? <Wand2 size={16} className="animate-spin" /> : <Play size={16} className="fill-white" />}
                         {isTesting ? "Testing..." : "Run Test"}
                       </button>
                    </div>

                    {(testResult || isTesting) && (
                      <div className="bg-black/30 rounded-2xl p-5 border border-slate-800 min-h-[120px] relative">
                         {isTesting ? (
                           <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 gap-2">
                             <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                             <span className="text-xs">Executing...</span>
                           </div>
                         ) : (
                           <div className="font-mono text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                             {testResult}
                           </div>
                         )}
                      </div>
                    )}
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptBuilder;