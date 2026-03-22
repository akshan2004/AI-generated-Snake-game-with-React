import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Terminal, Cpu, Activity } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#00ffff] font-sans selection:bg-[#ff00ff]/30 overflow-x-hidden relative crt-screen">
      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'linear-gradient(#00ffff 1px, transparent 1px), linear-gradient(90deg, #00ffff 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>
      
      <main className="relative z-10 container mx-auto px-4 py-8 md:py-16 flex flex-col items-center gap-12 md:gap-20">
        {/* Header Section */}
        <motion.header 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between gap-8 border-b-4 border-[#00ffff] pb-8 relative"
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <Terminal className="w-8 h-8 text-[#ff00ff] animate-pulse" />
              <h1 
                className="text-4xl md:text-7xl font-mono font-black tracking-tighter uppercase glitch-text"
                data-text="NEON_SNAKE_v3.0"
              >
                NEON_SNAKE_v3.0
              </h1>
            </div>
            <p className="font-mono text-xs md:text-sm text-[#ff00ff] tracking-[0.3em] uppercase">
              [STATUS: UNSTABLE] // NEURAL_LINK_ACTIVE
            </p>
          </div>

          <div className="flex flex-col items-end font-mono text-[10px] md:text-xs text-[#00ffff]/60 uppercase tracking-widest">
            <div className="flex items-center gap-3">
              <Activity className="w-4 h-4 text-[#39FF14]" />
              <span>CORE_TEMP: 42°C</span>
            </div>
            <div className="flex items-center gap-3">
              <Cpu className="w-4 h-4 text-[#ff00ff]" />
              <span>CPU_LOAD: 88%</span>
            </div>
            <div className="mt-2 px-2 py-1 border border-[#00ffff]/30 bg-[#00ffff]/5">
              SECURE_LINE_ENCRYPTED
            </div>
          </div>
        </motion.header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 md:gap-16 items-start w-full max-w-7xl">
          {/* Game Section */}
          <motion.section 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-col gap-6 w-full"
          >
            <div className="relative p-2 bg-[#00ffff]/10 border-4 border-[#00ffff] shadow-[0_0_20px_rgba(0,255,255,0.3)]">
              <div className="absolute -top-4 -left-4 bg-[#050505] px-2 text-[10px] font-mono text-[#ff00ff]">
                [INTERFACE_01]
              </div>
              <div className="bg-[#000] p-4 md:p-8 relative overflow-hidden">
                <SnakeGame />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-[#050505] px-2 text-[10px] font-mono text-[#ff00ff]">
                [RENDER_ACTIVE]
              </div>
            </div>

            {/* System Logs */}
            <div className="bg-[#00ffff]/5 border-2 border-[#00ffff]/30 p-4 font-mono text-[10px] uppercase tracking-wider space-y-2">
              <div className="flex gap-4 text-[#39FF14]">
                <span>[08:32:46]</span>
                <span>SYSTEM_INITIALIZED...</span>
              </div>
              <div className="flex gap-4 text-[#ff00ff]">
                <span>[08:32:47]</span>
                <span>NEURAL_LINK_ESTABLISHED...</span>
              </div>
              <div className="flex gap-4 text-[#00ffff] animate-pulse">
                <span>[08:32:48]</span>
                <span>WAITING_FOR_INPUT_SEQUENCE...</span>
              </div>
            </div>
          </motion.section>

          {/* Sidebar Section */}
          <motion.aside 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-col gap-8 w-full"
          >
            {/* Audio Station */}
            <div className="relative p-2 bg-[#ff00ff]/10 border-4 border-[#ff00ff] shadow-[0_0_20px_rgba(255,0,255,0.3)]">
              <div className="absolute -top-4 -left-4 bg-[#050505] px-2 text-[10px] font-mono text-[#00ffff]">
                [AUDIO_STATION]
              </div>
              <MusicPlayer />
            </div>

            {/* Directives Card */}
            <div className="bg-[#00ffff]/5 border-4 border-[#00ffff] p-6 space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 text-[8px] font-mono text-[#00ffff]/20">
                REF_ID: 0x4F2A
              </div>
              
              <h4 className="text-sm font-mono font-black uppercase tracking-[0.3em] text-[#ff00ff] flex items-center gap-3">
                <span className="w-2 h-2 bg-[#ff00ff] animate-ping" />
                SYSTEM_DIRECTIVES
              </h4>
              
              <div className="space-y-4 text-[12px] font-mono leading-tight">
                <div className="flex gap-4 group/item cursor-default">
                  <span className="text-[#ff00ff]">[01]</span>
                  <span className="group-hover:text-white transition-colors">NAVIGATE_GRID_VIA_ARROW_KEYS</span>
                </div>
                <div className="flex gap-4 group/item cursor-default">
                  <span className="text-[#ff00ff]">[02]</span>
                  <span className="group-hover:text-white transition-colors">COLLECT_DATA_NODES_FOR_UPGRADE</span>
                </div>
                <div className="flex gap-4 group/item cursor-default">
                  <span className="text-[#ff00ff]">[03]</span>
                  <span className="group-hover:text-white transition-colors">AVOID_SELF_INTERSECTION_CRITICAL</span>
                </div>
                <div className="flex gap-4 group/item cursor-default">
                  <span className="text-[#ff00ff]">[04]</span>
                  <span className="group-hover:text-white transition-colors">PRESS_SPACE_TO_SUSPEND_LINK</span>
                </div>
              </div>

              <div className="pt-4 border-t-2 border-[#00ffff]/30">
                <div className="flex justify-between text-[9px] font-mono uppercase tracking-widest text-[#00ffff]/40">
                  <span>LATENCY: 12MS</span>
                  <span className="animate-pulse">SYNC_OK</span>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>

        {/* Footer */}
        <footer className="w-full max-w-7xl mt-auto pt-8 border-t-4 border-[#00ffff] flex flex-col md:flex-row justify-between items-center gap-8 font-mono text-[10px] uppercase tracking-[0.2em]">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-[#39FF14] animate-pulse" />
            <p>© 2026 NEON_SNAKE_SYSTEMS // [ENCRYPTED]</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-[#ff00ff]">
            <span className="hover:text-white cursor-pointer transition-colors glitch-hover">PRIVACY_PROTOCOL</span>
            <span className="hover:text-white cursor-pointer transition-colors glitch-hover">SOURCE_MANIFEST</span>
            <span className="hover:text-white cursor-pointer transition-colors glitch-hover">TERMINAL_EXIT</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
