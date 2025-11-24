import React, { useState, useRef, useEffect } from 'react';
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
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'model', text: '', isThinking: isThinkingMode }]);

    let fullResponse = '';
    try {
      const stream = streamChatResponse(messages, input, isThinkingMode);
      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => {
          const newHistory = [...prev];
          const lastMsg = newHistory[newHistory.length - 1];
          if (lastMsg.role === 'model') lastMsg.text = fullResponse;
          return newHistory;
        });
      }
    } catch (err) {
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
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="px-6 py-4 flex justify-between items-center bg-slate-900/40 backdrop-blur-md border-b border-slate-800/50 z-20 sticky top-0">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Bot className="text-blue-500" size={24} />
            AI 导师对话
          </h2>
        </div>
        
        {/* Modern Toggle */}
        <button 
          onClick={() => setIsThinkingMode(!isThinkingMode)}
          className={`group relative flex items-center gap-3 pl-3 pr-4 py-1.5 rounded-full border transition-all duration-300 overflow-hidden ${
            isThinkingMode 
              ? 'bg-indigo-900/30 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.3)]' 
              : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'
          }`}
        >
           {/* Background Mesh for active state */}
           {isThinkingMode && <div className="absolute inset-0 bg-indigo-500/10 animate-pulse"></div>}
           
           <div className={`p-1.5 rounded-full transition-colors ${isThinkingMode ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
              <BrainCircuit size={16} />
           </div>
           <div className="flex flex-col items-start relative z-10">
             <span className={`text-xs font-bold uppercase tracking-wide ${isThinkingMode ? 'text-indigo-300' : 'text-slate-400'}`}>Deep Thinking</span>
             <span className="text-[10px] opacity-70 leading-none">{isThinkingMode ? 'Gemini 3.0 Pro' : 'Standard'}</span>
           </div>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8 scrollbar-thin">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`flex max-w-[85%] lg:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-4 items-end`}>
              
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-br from-blue-500 to-blue-700' 
                  : 'bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600'
              }`}>
                {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-blue-300" />}
              </div>
              
              {/* Bubble */}
              <div className={`p-5 rounded-2xl shadow-md text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-sm shadow-blue-900/20' 
                  : 'bg-slate-800/80 border border-slate-700/50 text-slate-200 rounded-bl-sm backdrop-blur-sm'
              }`}>
                {msg.text || (isLoading && idx === messages.length - 1 ? (
                  <div className="flex gap-1 items-center h-5 px-2">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                  </div>
                ) : '')}
                
                {msg.isThinking && msg.role === 'model' && !isLoading && (
                  <div className="mt-4 pt-3 border-t border-indigo-500/20 flex items-center gap-2 text-xs text-indigo-300/80">
                    <BrainCircuit size={14} />
                    <span>Thinking Process utilized (32k context)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Floating Input Area */}
      <div className="p-6 pt-2 z-20">
        <div className="max-w-4xl mx-auto relative group">
          <div className="absolute inset-0 bg-blue-500/5 rounded-2xl blur-xl group-focus-within:bg-blue-500/10 transition-all"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/5 group-focus-within:ring-blue-500/50 group-focus-within:border-blue-500/50 transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              className="w-full bg-transparent text-white placeholder-slate-500 px-6 py-5 focus:outline-none resize-none h-auto min-h-[60px] max-h-32 scrollbar-hide"
              style={{ height: input.split('\n').length > 1 ? 'auto' : '60px' }}
            />
            <div className="absolute right-3 bottom-3 flex gap-2">
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all disabled:opacity-50 disabled:bg-slate-700 shadow-lg shadow-blue-600/20"
              >
                {isLoading ? <Sparkles size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          </div>
          <p className="text-center text-[10px] text-slate-600 mt-3 font-medium tracking-wide uppercase">
             PromptMaster AI • Powered by Gemini 3.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatTutor;