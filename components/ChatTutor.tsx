import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, Sparkles, BrainCircuit } from 'lucide-react';
import { streamChatResponse } from '../services/gemini';
import { Message } from '../types';

const ChatTutor: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "你好！我是你的 AI 提示词导师。我可以帮你掌握提示词工程，或者利用我的深度思考能力回答复杂问题。今天有什么可以帮你吗？" }
  ]);
  const [isThinkingMode, setIsThinkingMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: input };
    
    // Update UI immediately with user message
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Create a placeholder for the model response
    setMessages(prev => [...prev, { role: 'model', text: '', isThinking: isThinkingMode }]);

    let fullResponse = '';
    
    try {
      // Pass the history (messages) and the new input separately
      const stream = streamChatResponse(messages, input, isThinkingMode);

      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => {
          const newHistory = [...prev];
          const lastMsg = newHistory[newHistory.length - 1];
          if (lastMsg.role === 'model') {
            lastMsg.text = fullResponse;
          }
          return newHistory;
        });
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: '错误：无法连接到导师。' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100">
      {/* Header */}
      <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/95 backdrop-blur sticky top-0 z-10">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bot className="text-blue-500" />
            AI 导师对话
          </h2>
          <p className="text-slate-400 text-sm mt-1">问我任何关于提示词工程的问题。</p>
        </div>
        
        {/* Thinking Mode Toggle */}
        <button 
          onClick={() => setIsThinkingMode(!isThinkingMode)}
          className={`flex items-center gap-3 px-4 py-2 rounded-full border transition-all duration-300 ${
            isThinkingMode 
              ? 'bg-purple-900/30 border-purple-500/50 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
          }`}
        >
          <BrainCircuit size={18} className={isThinkingMode ? "animate-pulse" : ""} />
          <div className="flex flex-col items-start text-xs">
            <span className="font-semibold">深度思考 (Deep Thinking)</span>
            <span className="opacity-70">{isThinkingMode ? '开启 (Gemini 3 Pro)' : '关闭'}</span>
          </div>
          <div className={`w-8 h-4 rounded-full relative transition-colors ${isThinkingMode ? 'bg-purple-500' : 'bg-slate-600'}`}>
            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all duration-300 ${isThinkingMode ? 'left-4.5' : 'left-0.5'}`} />
          </div>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-4`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
                msg.role === 'user' ? 'bg-blue-600' : 'bg-slate-700'
              }`}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} className="text-blue-300" />}
              </div>
              
              <div className={`p-4 rounded-2xl shadow-md text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none'
              }`}>
                {msg.text || (isLoading && idx === messages.length - 1 ? <span className="animate-pulse">思考中...</span> : '')}
                
                {msg.isThinking && msg.role === 'model' && !isLoading && (
                  <div className="mt-3 pt-3 border-t border-slate-600/50 flex items-center gap-2 text-xs text-purple-400">
                    <BrainCircuit size={14} />
                    <span>已启用深度思考生成 (预算: 32k tokens)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <div className="max-w-4xl mx-auto relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="询问关于提示词的问题，或尝试复杂的推理任务..."
            className="w-full bg-slate-800/50 text-white placeholder-slate-500 border border-slate-700 rounded-2xl pl-5 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none h-14 min-h-[56px] max-h-32 scrollbar-hide"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
          >
            {isLoading ? <Sparkles size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
        <p className="text-center text-xs text-slate-600 mt-2">
          {isThinkingMode 
            ? "思考模式已激活。响应可能需要更长时间，但会更加透彻。"
            : "标准模式。针对聊天速度进行了优化。"}
        </p>
      </div>
    </div>
  );
};

export default ChatTutor;