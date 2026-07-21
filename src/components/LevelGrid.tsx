import React from 'react';
import { Category, UserProgress } from '../types';
import { Lock, CheckCircle2, Play, Trophy } from 'lucide-react';
import { motion } from 'motion/react';

interface LevelGridProps {
  category: Category;
  progress: UserProgress;
  onSelectLevel: (levelId: number) => void;
}

export default function LevelGrid({ category, progress, onSelectLevel }: LevelGridProps) {
  const completed = progress.levels[category.id] || [];
  
  return (
    <div className="p-8 max-w-7xl mx-auto h-full overflow-y-auto relative">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="mb-10 relative z-10 glass rounded-2xl p-8">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Parcours {category.name}</h3>
        <p className="text-gray-400 max-w-2xl leading-relaxed">{category.description}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-10 gap-3 pb-20 relative z-10">
        {category.levels.map((level, idx) => {
          const isCompleted = completed.includes(level.id);
          const isUnlocked = category.id === 'daily' ? true : (level.id === 1 || completed.includes(level.id - 1));
          const isBoss = level.id === category.levels.length && category.id !== 'daily';
          
          let diffLabel = '';
          let badgeStyles = '';
          
          const ratio = level.id / category.levels.length;
          if (ratio <= 0.33) {
            diffLabel = 'Facile';
            badgeStyles = isCompleted ? 'bg-black/20 text-white border-white/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
          } else if (ratio <= 0.66) {
            diffLabel = 'Moyen';
            badgeStyles = isCompleted ? 'bg-black/20 text-white border-white/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30';
          } else {
            diffLabel = 'Difficile';
            badgeStyles = isCompleted ? 'bg-black/20 text-white border-white/30' : 'bg-red-500/20 text-red-400 border-red-500/30';
          }

          return (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(idx * 0.015, 0.4) }}
              key={level.id}
              disabled={!isUnlocked}
              onClick={() => onSelectLevel(level.id)}
              className={`
                relative aspect-square rounded-xl p-3 flex flex-col items-center justify-center transition-all
                ${!isUnlocked ? 'bg-white/5 text-white/20 border border-transparent cursor-not-allowed' : ''}
                ${isUnlocked && !isCompleted && !isBoss ? 'glass text-gray-300 hover:text-blue-400 hover:border-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:-translate-y-1 cursor-pointer' : ''}
                ${isCompleted && !isBoss ? 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)] border border-transparent hover:bg-emerald-400 hover:-translate-y-1' : ''}
                ${isBoss && isUnlocked && !isCompleted ? 'bg-amber-500/10 text-amber-500 border-2 border-amber-500/50 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:-translate-y-1 cursor-pointer' : ''}
                ${isBoss && isCompleted ? 'bg-amber-500 text-white border-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)] hover:bg-amber-400 hover:-translate-y-1 cursor-pointer' : ''}
              `}
            >
              <div className="absolute top-2 left-2 right-2 flex justify-center">
                 <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${badgeStyles} ${!isUnlocked ? 'opacity-40' : ''}`}>
                   {diffLabel}
                 </span>
              </div>
              <span className={`text-xl font-bold tracking-tight mt-3`}>{level.id}</span>
              
              <div className="mt-2">
                {!isUnlocked && <Lock size={16} />}
                {isUnlocked && !isCompleted && !isBoss && <Play size={16} className="opacity-50" />}
                {isCompleted && <CheckCircle2 size={16} />}
                {isBoss && isUnlocked && !isCompleted && <Trophy size={16} />}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
