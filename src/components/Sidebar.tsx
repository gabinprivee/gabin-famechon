import React from 'react';
import { categories } from '../data';
import { CategoryId, UserProgress } from '../types';
import { Crosshair, Building2, Target, Map, Home, Code2, Calendar, Crown } from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  currentCategory: CategoryId | 'home';
  setCurrentCategory: (c: CategoryId | 'home') => void;
  progress: UserProgress;
}

const icons = {
  fps: Crosshair,
  tycoon: Building2,
  precision: Target,
  strategy: Map,
  daily: Calendar,
  secret: Crown,
};

export default function Sidebar({ currentCategory, setCurrentCategory, progress }: SidebarProps) {
  return (
    <div className="w-64 glass border-r border-white/5 p-6 flex flex-col h-full text-gray-300 relative z-20">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]">C</div>
        <h1 className="text-lg font-bold tracking-tight text-white leading-tight">CODE<br/><span className="text-blue-500">ARCADE</span></h1>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto pr-2">
        <button
          onClick={() => setCurrentCategory('home')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${currentCategory === 'home' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'hover:bg-white/5 text-gray-400 hover:text-white border border-transparent'}`}
        >
          <Home size={18} />
          <span className="font-medium text-sm">Tableau de bord</span>
        </button>

        <div className="pt-6 pb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          Parcours d'Apprentissage
        </div>

        {categories.map(cat => {
          const isSecret = cat.id === 'secret';
          const allThemesCompleted = categories.filter(c => c.id !== 'daily' && c.id !== 'secret').every(c => (progress.levels[c.id]?.length || 0) === c.levels.length);
          
          if (isSecret && !allThemesCompleted) return null;

          const Icon = icons[cat.id as keyof typeof icons] || Home;
          const completedCount = progress.levels[cat.id]?.length || 0;
          const totalLevels = cat.levels.length;
          const isActive = currentCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setCurrentCategory(cat.id)}
              className={`w-full flex flex-col items-start px-4 py-3 rounded-xl transition-all ${isActive ? (isSecret ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]') : (isSecret ? 'hover:bg-amber-500/10 text-amber-500/70 hover:text-amber-400 border border-transparent' : 'hover:bg-white/5 text-gray-400 hover:text-white border border-transparent')}`}
            >
              <div className="flex items-center gap-3 w-full">
                <Icon size={18} />
                <span className="font-medium text-sm">{cat.name}</span>
              </div>
              <div className="w-full mt-3 bg-white/5 rounded-full h-1 overflow-hidden border border-white/5">
                <motion.div 
                  className={`h-full ${isSecret ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(completedCount / totalLevels) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-gray-500 font-mono mt-1.5">{completedCount} / {totalLevels} complétés</span>
            </button>
          );
        })}
      </nav>
      
      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="flex items-center justify-center gap-2 bg-white/5 px-3 py-2 rounded-full border border-white/10 w-full mb-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-medium text-gray-300">AUTO-SAVE: ON</span>
        </div>
      </div>
    </div>
  );
}
