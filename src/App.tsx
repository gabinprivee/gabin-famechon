/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CategoryId, UserProgress, Level } from './types';
import { categories, achievements } from './data';
import Sidebar from './components/Sidebar';
import LevelGrid from './components/LevelGrid';
import LevelModal from './components/LevelModal';
import AIGuide from './components/AIGuide';
import { Trophy, ArrowRight, Code2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('gameDevProgress');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.levels) {
        return { levels: parsed, achievements: [], dailyStreak: 0 };
      }
      return parsed;
    }
    return { levels: { fps: [], tycoon: [], precision: [], strategy: [], daily: [] }, achievements: [], dailyStreak: 0 };
  });
  const [currentCategory, setCurrentCategory] = useState<CategoryId | 'home'>('home');
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const [aiMessage, setAiMessage] = useState("Salut ! Je suis ton mentor IA personnel. Je vais t'accompagner dans ta quête pour devenir développeur de jeux vidéo. Choisis une catégorie pour commencer !");

  useEffect(() => {
    localStorage.setItem('gameDevProgress', JSON.stringify(progress));
    
    // AI Logic based on overall progress
    const totalCompleted = Object.values(progress.levels || {}).flat().length;
    if (totalCompleted === 1) setAiMessage("Excellent ! Tu as validé ton tout premier niveau. Les bases sont essentielles.");
    else if (totalCompleted === 10) setAiMessage("Déjà 10 niveaux complétés ! Tu commences à avoir de bons réflexes de programmeur.");
    else if (totalCompleted === 100) setAiMessage("100 niveaux ! Tu as validé l'équivalent d'une catégorie entière. Continue comme ça !");
    else if (totalCompleted === 200) setAiMessage("200 niveaux... La moitié du chemin est faite. La logique des moteurs de jeu n'a presque plus de secret pour toi.");
    else if (totalCompleted === 399) setAiMessage("Plus qu'un seul niveau avant la fin... Tu es prêt.");
    else if (totalCompleted === 400) setAiMessage("INCROYABLE ! Tu as terminé les 400 défis. Tu es officiellement prêt à coder tes propres jeux et à fonder ton studio !");
  }, [progress]);

  const handleLevelComplete = (categoryId: CategoryId, levelId: number) => {
    setProgress(prev => {
      const catProgress = prev.levels[categoryId] || [];
      if (!catProgress.includes(levelId)) {
        const newLevels = {
          ...prev.levels,
          [categoryId]: [...catProgress, levelId]
        };
        
        const newAchievements = [...(prev.achievements || [])];
        const totalCompleted = Object.values(newLevels).flat().length;

        if (totalCompleted >= 1 && !newAchievements.includes('first_blood')) newAchievements.push('first_blood');
        if (totalCompleted >= 10 && !newAchievements.includes('apprentice')) newAchievements.push('apprentice');
        if (totalCompleted >= 100 && !newAchievements.includes('master')) newAchievements.push('master');
        
        if (newLevels.fps && newLevels.fps.length >= 100 && !newAchievements.includes('fps_master')) newAchievements.push('fps_master');
        if (newLevels.tycoon && newLevels.tycoon.length >= 100 && !newAchievements.includes('tycoon_master')) newAchievements.push('tycoon_master');
        
        let streak = prev.dailyStreak || 0;
        let lastDaily = prev.dailyLastCompleted;
        if (categoryId === 'daily') {
          const today = new Date().toDateString();
          if (lastDaily !== today) {
            streak = lastDaily === new Date(Date.now() - 86400000).toDateString() ? streak + 1 : 1;
            lastDaily = today;
          }
        }
        if (streak >= 3 && !newAchievements.includes('streak_3')) newAchievements.push('streak_3');

        return {
          ...prev,
          levels: newLevels,
          achievements: newAchievements,
          dailyStreak: streak,
          dailyLastCompleted: lastDaily
        };
      }
      return prev;
    });
    
    // AI context sensitive messages
    if (levelId === 100) {
      setAiMessage(`Félicitations pour avoir terminé le projet final de la catégorie ! Ton jeu est super cool.`);
    } else if (levelId === 50) {
      setAiMessage(`Niveau 50 atteint dans cette catégorie. C'est le point de bascule, les choses vont se corser !`);
    } else {
      const messages = [
        "Bien joué ! Le code est propre.",
        "Exercice validé ! On passe au suivant.",
        "Parfait. Tu as bien utilisé la logique demandée.",
        "Superbe optimisation !",
        "C'était pas facile, mais tu l'as fait."
      ];
      setAiMessage(messages[Math.floor(Math.random() * messages.length)]);
    }
  };

  const activeCategory = currentCategory !== 'home' ? categories.find(c => c.id === currentCategory) : null;
  const activeLevel = activeCategory && selectedLevelId ? activeCategory.levels.find(l => l.id === selectedLevelId) : null;

  const totalProgress = Object.values(progress.levels || {}).flat().length;

  return (
    <div className="flex h-screen overflow-hidden font-sans text-[#E0E6ED]" style={{ background: 'radial-gradient(circle at top right, #1A1F2C 0%, #05070A 100%)' }}>
      <Sidebar 
        currentCategory={currentCategory} 
        setCurrentCategory={setCurrentCategory} 
        progress={progress} 
      />

      <main className="flex-1 relative">
        {currentCategory === 'home' ? (
          <div className="p-12 max-w-5xl mx-auto h-full overflow-y-auto relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
            <h2 className="text-4xl font-bold text-white mb-2 relative z-10">Tableau de bord</h2>
            <p className="text-gray-400 mb-12 relative z-10">Suis ta progression globale dans l'apprentissage du développement de jeux vidéo.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 relative z-10">
              <div className="glass rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none"></div>
                <div className="flex items-center gap-4 mb-4 relative z-10">
                  <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center text-blue-400">
                    <Trophy size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">Progression Globale</h3>
                    <p className="text-gray-400 text-sm font-mono">{totalProgress} / 400 défis complétés</p>
                  </div>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 mt-6 overflow-hidden border border-white/5 relative z-10">
                  <motion.div 
                    className="h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${(totalProgress / 400) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>

              <div className="glass rounded-2xl p-8 flex flex-col justify-center relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-lg font-bold text-white mb-4 tracking-tight">Commencer l'apprentissage</h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">Choisis une spécialité dans le menu de gauche. Chaque spécialité contient 100 niveaux allant des bases jusqu'à un projet final complet en HTML/CSS/JS. Découvre aussi les défis quotidiens !</p>
                  <div className="flex gap-2 items-center w-fit bg-white/5 px-4 py-2 rounded-full border border-white/10">
                    <Code2 size={16} className="text-emerald-500" />
                    <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">HTML, CSS, JS</span>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 relative z-10">Tes spécialités</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-10 relative z-10">
              {categories.map(cat => {
                const isSecret = cat.id === 'secret';
                const allThemesCompleted = categories.filter(c => c.id !== 'daily' && c.id !== 'secret').every(c => (progress.levels[c.id]?.length || 0) === c.levels.length);
                
                if (isSecret && !allThemesCompleted) return null;

                const completedCount = progress.levels[cat.id]?.length || 0;
                const totalLevels = cat.levels.length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCurrentCategory(cat.id)}
                    className={`glass rounded-xl p-6 transition-all text-left flex items-center justify-between group ${isSecret ? 'border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:bg-amber-500/10' : 'hover:bg-white/5 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]'}`}
                  >
                    <div>
                      <h4 className={`font-bold text-lg tracking-tight ${isSecret ? 'text-amber-400' : 'text-white'}`}>{cat.name}</h4>
                      <p className={`text-xs font-mono mt-2 ${isSecret ? 'text-amber-300' : 'text-blue-400'}`}>{completedCount} / {totalLevels} Niveaux</p>
                    </div>
                    <ArrowRight className={`${isSecret ? 'text-amber-600 group-hover:text-amber-400' : 'text-gray-600 group-hover:text-blue-400'} transition-colors`} />
                  </button>
                )
              })}
            </div>
            
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 relative z-10">Succès Débloqués</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-20 relative z-10">
              {progress.achievements && progress.achievements.length === 0 && (
                <div className="col-span-3 text-sm text-gray-500 italic">Aucun succès pour le moment. Complète des niveaux pour en débloquer !</div>
              )}
              {progress.achievements && progress.achievements.map(achId => {
                const ach = achievements.find(a => a.id === achId);
                if (!ach) return null;
                return (
                  <div key={achId} className="glass rounded-xl p-4 flex items-center gap-3 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                    <Trophy className="text-emerald-400" size={20} />
                    <div>
                      <div className="text-sm font-bold text-white">{ach.title}</div>
                      <div className="text-[10px] text-gray-400 mt-1 line-clamp-1">{ach.description}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          activeCategory && (
            <LevelGrid 
              category={activeCategory} 
              progress={progress} 
              onSelectLevel={setSelectedLevelId} 
            />
          )
        )}
      </main>

      <AIGuide message={aiMessage} />

      <AnimatePresence>
        {activeLevel && (
          <LevelModal
            level={activeLevel}
            isCompleted={(progress.levels[activeCategory!.id] || []).includes(activeLevel.id)}
            onClose={() => setSelectedLevelId(null)}
            onComplete={() => handleLevelComplete(activeCategory!.id, activeLevel.id)}
            hasNextLevel={activeLevel.id < activeCategory!.levels.length}
            onNextLevel={() => {
              handleLevelComplete(activeCategory!.id, activeLevel.id);
              setSelectedLevelId(activeLevel.id + 1);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
