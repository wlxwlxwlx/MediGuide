import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Hospital, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/src/lib/utils';
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isAnalysis?: boolean;
}

export default function MedicalChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '您好！我是您的智能医疗助手。请告诉我您目前的不适症状，我会为您提供初步的科室建议。' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `作为一个智能医疗导诊助手，请分析用户的症状并给出建议。
        如果是紧急情况，请务必提醒用户立即就医。
        请以 Markdown 格式回答。
        
        用户症状: ${userMessage}`,
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response.text || "抱歉，我无法处理您的请求。" }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "网络连接出现问题，请稍后再试。" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-50">
      {/* Header */}
      <div className="bg-emerald-600 p-4 text-white flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-lg">
          <Bot size={24} />
        </div>
        <div>
          <h2 className="font-display font-semibold">智能导诊助手</h2>
          <p className="text-xs text-emerald-100">AI 辅助症状分析与科室建议</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-3 max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                msg.role === 'user' ? "bg-emerald-600 text-white" : "bg-white border border-emerald-100 text-emerald-600 shadow-sm"
              )}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={cn(
                "p-3 rounded-2xl text-sm leading-relaxed",
                msg.role === 'user' 
                  ? "bg-emerald-600 text-white rounded-tr-none" 
                  : "bg-white text-slate-700 shadow-sm border border-emerald-50 rounded-tl-none"
              )}>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-white border border-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
              <Loader2 size={16} className="animate-spin" />
            </div>
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-emerald-50">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="描述您的症状，例如：头痛、发烧..."
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="mt-2 text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
          <AlertCircle size={10} /> AI 建议仅供参考，不作为最终诊断，危急情况请立即拨打 120
        </p>
      </div>
    </div>
  );
}
