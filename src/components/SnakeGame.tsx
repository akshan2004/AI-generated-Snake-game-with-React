import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, Play, RotateCcw, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { playSound } from '../utils/sounds';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 150;

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snakeHighScore');
    return saved ? parseInt(saved) : 0;
  });
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [inputQueue, setInputQueue] = useState<({ x: number, y: number })[]>([]);

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const lastProcessedDirection = useRef(direction);

  // Sync high score and check for new record
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      setIsNewRecord(true);
      localStorage.setItem('snakeHighScore', score.toString());
    }
    
    // Level up every 50 points
    const newLevel = Math.floor(score / 50) + 1;
    if (newLevel !== level && score > 0) {
      setLevel(newLevel);
      setShowLevelUp(true);
      playSound('levelUp');
      setTimeout(() => setShowLevelUp(false), 2000);
    }
  }, [score, highScore, level]);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food is on snake
      const onSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    lastProcessedDirection.current = INITIAL_DIRECTION;
    setInputQueue([]);
    setFood(generateFood());
    setScore(0);
    setLevel(1);
    setIsNewRecord(false);
    setIsGameOver(false);
    setIsPaused(true);
    setSpeed(INITIAL_SPEED);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      
      // Process next direction from queue
      let nextDir = direction;
      if (inputQueue.length > 0) {
        nextDir = inputQueue[0];
        setDirection(nextDir);
        setInputQueue(prev => prev.slice(1));
      }
      lastProcessedDirection.current = nextDir;

      const newHead = {
        x: (head.x + nextDir.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + nextDir.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        playSound('gameOver');
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if food eaten
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood());
        playSound('eat');
        // Increase speed: faster decrement as level increases
        const speedDecrement = 2 + Math.floor(level / 2);
        setSpeed(prev => Math.max(prev - speedDecrement, 45));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver) return;
      
      let nextDir: { x: number, y: number } | null = null;
      
      switch (e.key) {
        case 'ArrowUp':
          nextDir = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          nextDir = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          nextDir = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          nextDir = { x: 1, y: 0 };
          break;
        case ' ':
          setIsPaused(p => !p);
          return;
      }

      if (nextDir) {
        setInputQueue(prev => {
          // Get the last intended direction (either from queue or current)
          const lastDir = prev.length > 0 ? prev[prev.length - 1] : lastProcessedDirection.current;
          
          // Prevent reversing direction
          if (nextDir!.x !== -lastDir.x || nextDir!.y !== -lastDir.y) {
            // Only queue if it's a different direction and queue isn't too long
            if ((nextDir!.x !== lastDir.x || nextDir!.y !== lastDir.y) && prev.length < 3) {
              return [...prev, nextDir!];
            }
          }
          return prev;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, speed);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPaused, isGameOver, speed, moveSnake]);

  return (
    <div className="flex flex-col items-center gap-6 md:gap-10 w-full max-w-full overflow-hidden">
      {/* Scoreboard Section */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-[500px] font-mono">
        <div className="flex flex-col gap-1 bg-[#00ffff]/5 border-2 border-[#00ffff] p-3 relative overflow-hidden group hover:border-[#ff00ff] transition-colors">
          <span className="text-[8px] text-[#00ffff]/60 uppercase tracking-widest">DATA_SCORE</span>
          <span className="text-xl md:text-2xl font-black text-[#00ffff] glow-blue">{score}</span>
          {isNewRecord && (
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: '-100%' }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute bottom-0 left-0 w-full h-[2px] bg-[#ff00ff] shadow-[0_0_10px_#ff00ff]"
            />
          )}
        </div>

        <div className="flex flex-col items-center justify-center gap-1 bg-[#ff00ff]/5 border-2 border-[#ff00ff] p-3 relative overflow-hidden group hover:border-[#00ffff] transition-colors">
          <span className="text-[8px] text-[#ff00ff]/60 uppercase tracking-widest">LEVEL</span>
          <motion.span 
            key={level}
            initial={{ scale: 1.5, color: '#ff00ff' }}
            animate={{ scale: 1, color: '#ff00ff' }}
            className="text-xl md:text-2xl font-black glow-pink"
          >
            {level.toString().padStart(2, '0')}
          </motion.span>
        </div>

        <div className="flex flex-col items-end gap-1 bg-[#00ffff]/5 border-2 border-[#00ffff] p-3 relative overflow-hidden group hover:border-[#ff00ff] transition-colors">
          <span className="text-[8px] text-[#00ffff]/60 uppercase tracking-widest">PEAK_RECORD</span>
          <div className="flex items-center gap-2">
            <Trophy className={`w-3 h-3 md:w-4 md:h-4 text-[#ff00ff] glow-pink ${isNewRecord ? 'animate-bounce' : ''}`} />
            <span className="text-xl md:text-2xl font-black text-[#ff00ff] glow-blue">{highScore}</span>
          </div>
          {isNewRecord && (
            <span className="absolute -top-1 -right-1 bg-[#ff00ff] text-black text-[7px] font-bold px-1 animate-pulse">NEW</span>
          )}
        </div>
      </div>

      {/* Game Area Container */}
      <div className="relative group p-2 bg-[#00ffff]/10 border-4 border-[#00ffff] shadow-[0_0_30px_rgba(0,255,255,0.2)]">
        {/* Decorative Corner Brackets */}
        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-[#ff00ff] z-30" />
        <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-[#ff00ff] z-30" />
        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-[#ff00ff] z-30" />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-[#ff00ff] z-30" />

        {/* Game Board */}
        <div 
          className="grid bg-[#000] border-2 border-[#00ffff]/30 relative"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            width: 'min(85vw, 440px)',
            aspectRatio: '1/1'
          }}
        >
          {/* Grid Lines Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.05]" 
               style={{ 
                 backgroundImage: `linear-gradient(to right, #00ffff 1px, transparent 1px), linear-gradient(to bottom, #00ffff 1px, transparent 1px)`,
                 backgroundSize: `${100/GRID_SIZE}% ${100/GRID_SIZE}%`
               }} 
          />

          {/* Food */}
          <motion.div
            layoutId="food"
            className="bg-[#ff00ff] shadow-[0_0_20px_#ff00ff] z-10 m-[10%]"
            style={{
              gridColumnStart: food.x + 1,
              gridRowStart: food.y + 1,
            }}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8],
              boxShadow: [
                "0 0 10px #ff00ff",
                "0 0 25px #ff00ff",
                "0 0 10px #ff00ff"
              ]
            }}
            transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
          />

          {/* Snake */}
          {snake.map((segment, i) => (
            <motion.div
              key={`${i}-${segment.x}-${segment.y}`}
              layout
              className={`${i === 0 ? 'bg-[#00ffff]' : 'bg-[#00ffff]/60'} z-20`}
              style={{
                gridColumnStart: segment.x + 1,
                gridRowStart: segment.y + 1,
                boxShadow: i === 0 
                  ? '0 0 15px #00ffff' 
                  : '0 0 5px #00ffff',
                zIndex: snake.length - i
              }}
              initial={false}
              transition={{ type: "tween", duration: 0.1 }}
            />
          ))}
        </div>

        {/* Overlays */}
        <AnimatePresence>
          {showLevelUp && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
              className="absolute inset-0 flex flex-col items-center justify-center z-[60] pointer-events-none"
            >
              <div className="text-4xl font-mono font-black text-[#ff00ff] uppercase italic tracking-tighter glitch-text" data-text="LEVEL_UP">
                LEVEL_UP
              </div>
              <div className="text-[#00ffff] font-mono text-[10px] tracking-[0.5em] uppercase mt-2">
                DIFFICULTY_INCREASED
              </div>
            </motion.div>
          )}

          {(isPaused || isGameOver) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-50 p-8 border-4 border-[#ff00ff]/30"
            >
              {isGameOver ? (
                <div className="text-center space-y-8 w-full">
                  <div className="space-y-2">
                    <h2 className="text-4xl md:text-5xl font-mono font-black text-[#ff00ff] uppercase tracking-tighter glitch-text" data-text="SYSTEM_FAILURE">
                      SYSTEM_FAILURE
                    </h2>
                    <p className="text-[10px] font-mono text-[#ff00ff]/60 uppercase tracking-[0.5em]">NEURAL_LINK_TERMINATED</p>
                  </div>
                  
                  <div className="bg-[#ff00ff]/5 border-2 border-[#ff00ff]/30 p-4 font-mono max-w-[280px] mx-auto">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[#ff00ff]/40 text-[10px]">FINAL_SCORE</span>
                      <span className="text-[#00ffff] font-black">{score}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#ff00ff]/40 text-[10px]">NODES_SYNCED</span>
                      <span className="text-[#00ffff] font-black">{Math.floor(score / 10)}</span>
                    </div>
                  </div>

                  <button 
                    onClick={resetGame}
                    className="group relative flex items-center gap-4 mx-auto px-8 py-4 bg-[#ff00ff] text-black font-mono font-black uppercase tracking-widest hover:bg-[#00ffff] transition-colors active:scale-95 shadow-[0_0_20px_#ff00ff]"
                  >
                    <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />
                    REBOOT_SYSTEM
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-10">
                  <div className="space-y-2">
                    <h2 className="text-4xl md:text-5xl font-mono font-black text-[#00ffff] uppercase tracking-widest glitch-text" data-text="STANDBY">STANDBY</h2>
                    <p className="text-[10px] font-mono text-[#00ffff]/60 uppercase tracking-[0.5em]">NEURAL_LINK_PAUSED</p>
                  </div>
                  
                  <button 
                    onClick={() => setIsPaused(false)}
                    className="group relative flex items-center justify-center w-24 h-24 bg-transparent border-4 border-[#00ffff] hover:border-[#ff00ff] transition-colors active:scale-90 shadow-[0_0_30px_rgba(0,255,255,0.3)]"
                  >
                    <Play className="w-12 h-12 text-[#00ffff] group-hover:text-[#ff00ff] fill-current ml-2 transition-colors" />
                  </button>
                  
                  <div className="flex flex-col gap-2">
                    <p className="text-[#00ffff]/60 text-[10px] font-mono uppercase tracking-[0.3em] animate-pulse">
                      PRESS [SPACE] TO RE-INITIALIZE
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls Help */}
      <div className="grid grid-cols-2 gap-4 text-[10px] font-mono text-[#00ffff]/40 uppercase tracking-[0.2em] w-full max-w-[500px]">
        <div className="flex items-center gap-3 bg-[#00ffff]/5 px-4 py-2 border-2 border-[#00ffff]/20">
          <span className="text-[#ff00ff]">ARROWS</span>
          <span>NAVIGATE</span>
        </div>
        <div className="flex items-center gap-3 bg-[#00ffff]/5 px-4 py-2 border-2 border-[#00ffff]/20">
          <span className="text-[#ff00ff]">SPACE</span>
          <span>SUSPEND</span>
        </div>
      </div>
    </div>
  );
}
