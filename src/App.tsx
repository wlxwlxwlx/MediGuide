import React, { useState } from 'react';
import { Stethoscope, Heart, ShieldCheck, Activity, Menu, X, Info, Hospital } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import MedicalChat from './components/MedicalChat';
import HospitalFinder from './components/HospitalFinder';
import { cn } from './lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'hospitals'>('chat');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
                <Stethoscope size={24} />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                MediGuide AI
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => setActiveTab('chat')}
                className={cn(
                  "text-sm font-medium transition-colors",
                  activeTab === 'chat' ? "text-blue-600" : "text-slate-500 hover:text-blue-500"
                )}
              >
                智能导诊
              </button>
              <button 
                onClick={() => setActiveTab('hospitals')}
                className={cn(
                  "text-sm font-medium transition-colors",
                  activeTab === 'hospitals' ? "text-blue-600" : "text-slate-500 hover:text-blue-500"
                )}
              >
                附近医院
              </button>
              <div className="h-6 w-px bg-slate-200" />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all shadow-md shadow-blue-100">
                立即咨询
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-4">
              <button 
                onClick={() => { setActiveTab('chat'); setIsMenuOpen(false); }}
                className="block w-full text-left px-4 py-2 text-slate-600 hover:bg-blue-50 rounded-lg"
              >
                智能导诊
              </button>
              <button 
                onClick={() => { setActiveTab('hospitals'); setIsMenuOpen(false); }}
                className="block w-full text-left px-4 py-2 text-slate-600 hover:bg-blue-50 rounded-lg"
              >
                附近医院
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <header className="relative bg-white overflow-hidden pt-12 pb-24">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-indigo-50 rounded-full blur-3xl opacity-50" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold mb-6 border border-blue-100"
            >
              <Activity size={14} /> AI 驱动的智能医疗助手
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6"
            >
              您的全天候 <span className="text-blue-600">智能医疗</span> 导诊专家
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-600 mb-10 leading-relaxed"
            >
              通过先进的 AI 技术，为您提供精准的症状分析、科室推荐及就医建议，让就医更简单、更高效。
            </motion.p>
          </div>

          {/* Main Content Area */}
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="bg-slate-100 p-1 rounded-2xl flex gap-1 shadow-inner">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-sm font-semibold transition-all",
                    activeTab === 'chat' 
                      ? "bg-white text-blue-600 shadow-sm" 
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  智能导诊
                </button>
                <button
                  onClick={() => setActiveTab('hospitals')}
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-sm font-semibold transition-all",
                    activeTab === 'hospitals' 
                      ? "bg-white text-blue-600 shadow-sm" 
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  附近医院
                </button>
              </div>
            </div>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === 'chat' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {activeTab === 'chat' ? <MedicalChat /> : <HospitalFinder />}
            </motion.div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                <Heart size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">专业症状分析</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                基于海量医学数据，精准识别您的不适症状，并提供科学的初步分析建议。
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">精准科室���荐</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                根据症状描述，为您推荐最合适的就诊科室，避免挂错号、走弯路。
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600 mb-6">
                <Hospital size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">优质资源导航</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                一键获取周边三甲医院信息，支持实时导航，助您快速获得专业医疗救治。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                <Stethoscope size={20} />
              </div>
              <span className="text-lg font-bold text-slate-900">MediGuide AI</span>
            </div>
            <div className="flex gap-8 text-sm text-slate-500">
              <a href="#" className="hover:text-blue-600 transition-colors">隐私政策</a>
              <a href="#" className="hover:text-blue-600 transition-colors">服务条款</a>
              <a href="#" className="hover:text-blue-600 transition-colors">联系我们</a>
            </div>
            <p className="text-xs text-slate-400">
              © 2026 MediGuide AI. 仅供参考，不作为医疗诊断依据。
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
