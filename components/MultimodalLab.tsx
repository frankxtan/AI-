import React, { useState, useRef } from 'react';
import { Eye, Upload, Image as ImageIcon, Sparkles, X, Aperture, MousePointerClick, Palette, Download } from 'lucide-react';
import { analyzeImage, generateImage } from '../services/gemini';

const MultimodalLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analyze' | 'generate'>('analyze');
  
  // Analysis State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [rawBase64, setRawBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generation State
  const [genPrompt, setGenPrompt] = useState('');
  const [generatedImageBase64, setGeneratedImageBase64] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Handlers (Same logic, new UI)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setSelectedImage(result);
        const base64Data = result.split(',')[1];
        setRawBase64(base64Data);
        setMimeType(file.type);
      };
      reader.readAsDataURL(file);
      setResult('');
    }
  };

  const handleAnalyze = async () => {
    if (!rawBase64 || !prompt.trim() || isLoading) return;
    setIsLoading(true);
    setResult('');
    try {
      const text = await analyzeImage(prompt, rawBase64, mimeType);
      setResult(text);
    } catch (err) {
      setResult("分析失败，请重试。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setRawBase64(null);
    setResult('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerate = async () => {
    if (!genPrompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setGeneratedImageBase64(null);
    try {
      const base64 = await generateImage(genPrompt);
      setGeneratedImageBase64(base64);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const suggestedAnalysisPrompts = [
    { title: "空间推理", text: "定位图片左侧的所有红色物体，并返回它们的相对坐标。" },
    { title: "视觉问答 (VQA)", text: "这张图片里发生了什么故事？请详细描述人物的情绪和环境氛围。" },
    { title: "代码生成", text: "根据这张网页截图，写出对应的 HTML 和 Tailwind CSS 代码。" },
  ];

  const suggestedGenPrompts = [
    { title: "赛博朋克", text: "一只在霓虹灯雨夜中奔跑的机械猫，赛博朋克风格，高细节，4k。" },
    { title: "极简设计", text: "一个极简主义的现代咖啡杯设计，背景是柔和的晨光，产品摄影风格。" },
    { title: "超现实", text: "大象在云端漫步，达利风格，超现实主义，梦幻般的色彩。" },
  ];

  return (
    <div className="h-full flex flex-col">
       {/* Top Nav Tabs */}
       <div className="px-6 lg:px-10 pt-6 pb-2 border-b border-slate-800/50 bg-slate-900/40 backdrop-blur-sm z-10 flex justify-between items-end shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">多模态实验室</h1>
            <p className="text-sm text-slate-400">Gemini Native Multimodal Capabilities</p>
          </div>
          <div className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700/50">
             <button
               onClick={() => setActiveTab('analyze')}
               className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'analyze' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'text-slate-400 hover:text-white'}`}
             >
               <Eye size={16}/> 视觉分析
             </button>
             <button
               onClick={() => setActiveTab('generate')}
               className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'generate' ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/20' : 'text-slate-400 hover:text-white'}`}
             >
               <Palette size={16}/> 图像生成
             </button>
          </div>
       </div>

       {/* Content Area - Scrollable on mobile via parent, or separate panes on desktop */}
       <div className="flex-1 overflow-y-auto lg:overflow-hidden">
          {activeTab === 'analyze' ? (
             <div className="flex flex-col lg:flex-row lg:h-full">
                {/* Left: Upload & Config */}
                <div className="w-full lg:w-1/2 h-auto lg:h-full lg:overflow-y-auto p-6 lg:p-10 border-r border-slate-800/50 bg-slate-900/20">
                   <div className="max-w-xl mx-auto space-y-6">
                      <div 
                        className={`border-2 border-dashed rounded-3xl transition-all aspect-video flex flex-col items-center justify-center relative overflow-hidden group ${
                          selectedImage 
                            ? 'border-slate-700 bg-black/40' 
                            : 'border-slate-700/50 bg-slate-800/20 hover:bg-slate-800/40 hover:border-purple-500/50 cursor-pointer'
                        }`}
                        onClick={() => !selectedImage && fileInputRef.current?.click()}
                      >
                        {selectedImage ? (
                          <>
                            <img src={selectedImage} alt="Upload" className="w-full h-full object-contain" />
                            <button onClick={(e) => { e.stopPropagation(); handleClearImage(); }} className="absolute top-4 right-4 bg-black/60 hover:bg-red-600/80 text-white p-2 rounded-xl backdrop-blur transition-all border border-white/10">
                              <X size={18} />
                            </button>
                          </>
                        ) : (
                          <div className="text-center p-6">
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-xl">
                               <Upload className="text-purple-400" size={28} />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-1">点击上传</h3>
                            <p className="text-sm text-slate-500">JPG, PNG (Max 5MB)</p>
                          </div>
                        )}
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />
                      </div>

                      <div className="space-y-4">
                         <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                           <Aperture size={16} className="text-purple-400" /> 分析指令
                         </label>
                         <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="例如：这张图里最不寻常的细节是什么？"
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-purple-500/50 transition-all h-32 resize-none"
                         />
                         
                         <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {suggestedAnalysisPrompts.map((p, i) => (
                               <button key={i} onClick={() => setPrompt(p.text)} className="shrink-0 px-3 py-2 bg-slate-800/50 border border-slate-700 hover:border-purple-500/30 rounded-lg text-xs text-slate-300 transition-all whitespace-nowrap">
                                  {p.title}
                               </button>
                            ))}
                         </div>

                         <button
                            onClick={handleAnalyze}
                            disabled={isLoading || !selectedImage || !prompt.trim()}
                            className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3.5 rounded-xl font-medium transition-all shadow-lg shadow-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                         >
                            {isLoading ? <Sparkles size={18} className="animate-spin" /> : <Eye size={18} />}
                            {isLoading ? "Gemini 正在观察..." : "执行视觉分析"}
                         </button>
                      </div>
                   </div>
                </div>

                {/* Right: Result */}
                <div className="w-full lg:w-1/2 h-auto lg:h-full lg:overflow-y-auto p-6 lg:p-10 bg-slate-950/40 backdrop-blur-md">
                   <div className="min-h-[300px] h-full rounded-3xl border border-slate-800 bg-slate-900/30 p-6 relative">
                      <label className="absolute top-4 left-4 text-xs font-bold text-slate-500 uppercase tracking-wide">Analysis Result</label>
                      {result ? (
                         <div className="mt-8 text-slate-200 whitespace-pre-wrap leading-relaxed animate-fade-in text-sm">{result}</div>
                      ) : (
                         <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-3 opacity-50 pt-10 lg:pt-0">
                            <ImageIcon size={40} />
                            <p className="text-sm">等待视觉数据输入...</p>
                         </div>
                      )}
                   </div>
                </div>
             </div>
          ) : (
             <div className="flex flex-col lg:flex-row lg:h-full">
                {/* Generation Layout */}
                <div className="w-full lg:w-1/2 h-auto lg:h-full lg:overflow-y-auto p-6 lg:p-10 border-r border-slate-800/50 bg-slate-900/20">
                    <div className="max-w-xl mx-auto space-y-6">
                       <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                             <Palette size={16} className="text-pink-400" /> 描述你的想象
                          </label>
                          <textarea
                             value={genPrompt}
                             onChange={(e) => setGenPrompt(e.target.value)}
                             placeholder="赛博朋克风格的街道..."
                             className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-pink-500/50 transition-all h-40 resize-none"
                          />
                       </div>
                       
                       <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">推荐风格</label>
                          <div className="grid grid-cols-1 gap-2">
                             {suggestedGenPrompts.map((p, i) => (
                                <button key={i} onClick={() => setGenPrompt(p.text)} className="text-left px-4 py-3 bg-slate-800/50 border border-slate-700 hover:border-pink-500/30 rounded-xl text-xs text-slate-300 transition-all group">
                                   <span className="block font-bold text-pink-400 mb-0.5 group-hover:text-pink-300">{p.title}</span>
                                   <span className="opacity-70 truncate block">{p.text}</span>
                                </button>
                             ))}
                          </div>
                       </div>

                       <button
                          onClick={handleGenerate}
                          disabled={isGenerating || !genPrompt.trim()}
                          className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white py-3.5 rounded-xl font-medium transition-all shadow-lg shadow-pink-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                       >
                          {isGenerating ? <Sparkles size={18} className="animate-spin" /> : <Palette size={18} />}
                          {isGenerating ? "正在绘制..." : "生成图像"}
                       </button>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 h-auto lg:h-full bg-black/50 p-6 lg:p-10 flex items-center justify-center relative min-h-[400px]">
                   {generatedImageBase64 ? (
                      <div className="relative max-w-full max-h-full group">
                         <img src={`data:image/jpeg;base64,${generatedImageBase64}`} alt="Gen" className="max-w-full max-h-[80vh] rounded-lg shadow-2xl" />
                         <a href={`data:image/jpeg;base64,${generatedImageBase64}`} download="gemini-art.jpg" className="absolute bottom-4 right-4 bg-slate-900/80 text-white px-4 py-2 rounded-lg backdrop-blur flex items-center gap-2 text-xs opacity-0 group-hover:opacity-100 transition-all border border-white/10 hover:bg-black">
                            <Download size={14} /> 下载原图
                         </a>
                      </div>
                   ) : (
                      <div className="text-center text-slate-600">
                         {isGenerating ? (
                            <div className="w-16 h-16 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
                         ) : (
                            <Palette size={48} className="mx-auto mb-4 opacity-20" />
                         )}
                         <p className="text-sm">{isGenerating ? "AI 正在计算像素..." : "画布空白"}</p>
                      </div>
                   )}
                </div>
             </div>
          )}
       </div>
    </div>
  );
};

export default MultimodalLab;