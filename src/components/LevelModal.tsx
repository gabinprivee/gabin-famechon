import React, { useState } from 'react';
import { Level } from '../types';
import { X, Terminal, Code2, Check, Play, MonitorPlay, SkipForward } from 'lucide-react';
import { motion } from 'motion/react';

interface LevelModalProps {
  level: Level;
  isCompleted: boolean;
  onClose: () => void;
  onComplete: () => void;
  hasNextLevel?: boolean;
  onNextLevel?: () => void;
}

export default function LevelModal({ level, isCompleted, onClose, onComplete, hasNextLevel, onNextLevel }: LevelModalProps) {
  const [code, setCode] = useState(level.codeSnippet || '');
  const [validating, setValidating] = useState(false);
  const [success, setSuccess] = useState(isCompleted);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  React.useEffect(() => {
    setCode(level.codeSnippet || '');
    setSuccess(isCompleted);
    setValidating(false);
    setErrorMsg(null);
  }, [level, isCompleted]);

  const handleValidate = () => {
    setValidating(true);
    setErrorMsg(null);
    
    // Simulate compilation / testing running for educational purpose
    setTimeout(() => {
      setValidating(false);
      
      try {
        new Function(code); // Syntax check

        if (level.testCode) {
          const testFunc = new Function('code', level.testCode);
          testFunc(code);
        } else if (code.trim().length < 15) {
          throw new Error("Le code est trop court pour être valide.");
        }

        setSuccess(true);
        onComplete();
      } catch (e: any) {
        setSuccess(false);
        setErrorMsg(e.message || "Erreur inconnue");
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass bg-[#05070A]/80 border-white/10 w-full max-w-5xl h-[85vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl relative"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none"></div>

        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold border border-blue-500/30">
              {level.id}
            </div>
            <h3 className="font-bold text-lg text-white tracking-tight">{level.title}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-2 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden relative z-10">
          {/* Instructions Sidebar */}
          <div className="w-full md:w-1/3 bg-transparent border-r border-white/5 p-6 overflow-y-auto">
            <h4 className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
              <Terminal size={16} />
              Instructions
            </h4>
            <p className="text-gray-300 mb-6 leading-relaxed text-sm">
              {level.description}
            </p>
            <div className="glass rounded-xl p-4 mb-6">
              <h5 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Objectif</h5>
              <p className="text-white text-sm leading-relaxed">
                {level.task}
              </p>
            </div>
            
            {level.id === 50 && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                <p className="text-amber-400 text-xs font-bold mb-1 uppercase tracking-widest">Projet Final</p>
                <p className="text-amber-200/70 text-sm">Ce défi valide la catégorie entière. Conçois ton mini-jeu en utilisant les concepts HTML, CSS et JS appris.</p>
              </div>
            )}

            <div className="text-[10px] text-gray-500 mt-auto pt-8 uppercase tracking-widest font-mono">
              Écris ton code JavaScript dans l'éditeur. Pour le HTML/CSS, imagine qu'ils sont liés.
            </div>
          </div>

          {/* Editor & Preview Area */}
          <div className="flex-1 bg-[#020305]/80 flex flex-col min-w-0">
            {/* Split Top: Editor */}
            <div className="flex-1 flex flex-col border-b border-white/10 min-h-0">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/5 text-gray-400 text-xs font-mono font-bold uppercase tracking-widest shrink-0">
                <Code2 size={14} />
                <span>script.js</span>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="flex-1 w-full bg-transparent text-gray-300 p-6 font-mono text-sm resize-none focus:outline-none focus:ring-inset focus:ring-1 focus:ring-blue-500/50 leading-relaxed"
              />
            </div>
            
            {/* Split Bottom: Preview */}
            <div className="flex-1 flex flex-col min-h-0 bg-black/50">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/5 text-gray-400 text-xs font-mono font-bold uppercase tracking-widest shrink-0">
                <MonitorPlay size={14} />
                <span>Rendu du Jeu (Live)</span>
              </div>
              <div className="flex-1 relative overflow-hidden bg-black flex items-center justify-center">
                <iframe 
                  title="game-preview"
                  className="w-full h-full border-none bg-black"
                  sandbox="allow-scripts"
                  srcDoc={`
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <style>
                          body { margin: 0; padding: 0; background-color: #05070A; color: #fff; font-family: monospace; overflow: hidden; display: flex; align-items: center; justify-content: center; height: 100vh; }
                          canvas { max-width: 100%; max-height: 100%; object-fit: contain; }
                          #console { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.8); color: #4ade80; padding: 12px; font-size: 12px; max-height: 40%; overflow-y: auto; pointer-events: none; border-top: 1px solid #1f2937; }
                          .log-err { color: #f87171; }
                          .log-info { color: #60a5fa; }
                          .log-succ { color: #34d399; }
                        </style>
                      </head>
                      <body>
                        <canvas id="gameCanvas" width="800" height="600"></canvas>
                        <div id="console"></div>
                        <script>
                          const con = document.getElementById('console');
                          const oldLog = console.log;
                          const oldErr = console.error;
                          
                          function printLog(msg, type='info') {
                            const div = document.createElement('div');
                            div.className = 'log-' + type;
                            div.innerText = '> ' + msg;
                            con.appendChild(div);
                            con.scrollTop = con.scrollHeight;
                          }
                          
                          console.log = function(...args) {
                            oldLog(...args);
                            printLog(args.join(' '), 'info');
                          };
                          console.error = function(...args) {
                            oldErr(...args);
                            printLog(args.join(' '), 'err');
                          };
                          
                          window.canvas = document.getElementById('gameCanvas');
                          window.ctx = window.canvas.getContext('2d');
                          let frame = 0;
                          
                          function draw() {
                            window.ctx.fillStyle = '#05070A';
                            window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height);
                            
                            // Grid background
                            window.ctx.strokeStyle = '#1e293b';
                            window.ctx.lineWidth = 1;
                            for(let i=0; i<window.canvas.width; i+=50) {
                              window.ctx.beginPath(); window.ctx.moveTo(i, 0); window.ctx.lineTo(i, window.canvas.height); window.ctx.stroke();
                            }
                            for(let i=0; i<window.canvas.height; i+=50) {
                              window.ctx.beginPath(); window.ctx.moveTo(0, i); window.ctx.lineTo(window.canvas.width, i); window.ctx.stroke();
                            }
                            
                            window.ctx.fillStyle = '#4ade80';
                            window.ctx.font = 'bold 20px monospace';
                            window.ctx.textAlign = 'left';
                            window.ctx.fillText('MOTEUR DE RENDU ACTIF', 20, 40);
                            window.ctx.fillStyle = '#64748b';
                            window.ctx.font = '14px monospace';
                            window.ctx.fillText('Niveau ${level.id} - ${level.title.replace(/`/g, "'")}', 20, 65);
                            
                            window.ctx.save();
                            window.ctx.translate(window.canvas.width/2, window.canvas.height/2);
                            
                            // Visual based on category
                            const cat = '${level.title.toLowerCase()}';
                            if (cat.includes('fps')) {
                               window.ctx.rotate(frame * 0.02);
                               window.ctx.fillStyle = '#ef4444'; 
                               window.ctx.fillRect(-30, -30, 60, 60);
                               window.ctx.fillStyle = '#b91c1c';
                               window.ctx.fillRect(-10, -10, 20, 20);
                            } else if (cat.includes('tycoon')) {
                               window.ctx.rotate(frame * 0.05);
                               window.ctx.fillStyle = '#eab308'; 
                               window.ctx.beginPath(); window.ctx.arc(0, 0, 40, 0, Math.PI*2); window.ctx.fill();
                               window.ctx.fillStyle = '#ca8a04';
                               window.ctx.beginPath(); window.ctx.arc(0, 0, 25, 0, Math.PI*2); window.ctx.fill();
                            } else if (cat.includes('précision') || cat.includes('precision')) {
                               window.ctx.rotate(frame * 0.08);
                               window.ctx.fillStyle = '#3b82f6'; 
                               window.ctx.beginPath(); window.ctx.moveTo(0, -40); window.ctx.lineTo(30, 30); window.ctx.lineTo(-30, 30); window.ctx.fill();
                            } else {
                               window.ctx.rotate(Math.sin(frame * 0.05) * 0.5);
                               window.ctx.strokeStyle = '#10b981';
                               window.ctx.lineWidth = 4;
                               window.ctx.strokeRect(-40, -40, 80, 80);
                               window.ctx.strokeRect(-20, -20, 40, 40);
                            }
                            window.ctx.restore();
                            
                            frame++;
                            window.requestAnimationFrame(draw);
                          }
                          draw();
                          
                          // Execute user code
                          window.onerror = function(msg, url, lineNo, columnNo, error) {
                            console.error('Erreur dans ton code : ' + msg.replace('Uncaught ', ''));
                            return false;
                          };
                          
                          printLog('Compilation en cours...', 'info');
                          
                          setTimeout(() => {
                            try {
                              const userCode = decodeURIComponent("${encodeURIComponent(code)}");
                              
                              const script = document.createElement('script');
                              script.textContent = userCode;
                              document.body.appendChild(script);
                              
                              let called = false;
                              const matches = [...userCode.matchAll(/function\\s+([a-zA-Z0-9_]+)\\s*\\(/g)];
                              
                              for (const match of matches) {
                                const fnName = match[1];
                                if (typeof window[fnName] === 'function') {
                                  window[fnName]();
                                  console.log('Exécution réussie : ' + fnName + '()');
                                  called = true;
                                }
                              }
                              
                              if (!called) {
                                console.log('Aucune fonction exécutable détectée.');
                              }
                            } catch (e) {
                              console.error('Erreur de syntaxe : ' + e.message);
                            }
                          }, 100);
                        </script>
                      </body>
                    </html>
                  `}
                />
              </div>
            </div>
            
            <div className="p-4 bg-white/5 border-t border-white/5 flex justify-between items-center backdrop-blur-md shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest font-mono">
                  Auto-Save Active
                </div>
              </div>
              <div className="flex items-center gap-3">
                {errorMsg && (
                  <div className="text-red-400 text-xs font-mono mr-4 max-w-xs truncate" title={errorMsg}>
                    {errorMsg}
                  </div>
                )}
                {hasNextLevel && (
                  <button
                    onClick={() => {
                      if (!success) onComplete();
                      onNextLevel?.();
                    }}
                    className="px-4 py-2.5 rounded-xl font-bold text-sm bg-white/5 hover:bg-white/10 text-gray-300 transition-all flex items-center gap-2 border border-white/5"
                  >
                    Niveau Suivant
                    <SkipForward size={16} />
                  </button>
                )}
                <button
                  onClick={handleValidate}
                  disabled={validating || success}
                  className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                    success 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default' 
                      : validating
                        ? 'bg-blue-500/50 text-white cursor-wait'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:-translate-y-0.5'
                  }`}
                >
                  {success ? (
                    <>
                      <Check size={18} />
                      Validé
                    </>
                  ) : validating ? (
                    'Exécution du test...'
                  ) : (
                    <>
                      <Play size={18} />
                      Exécuter & Valider
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
