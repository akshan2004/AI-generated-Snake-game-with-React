import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const PLAYLIST = [
  {
    title: "Neon Nights",
    artist: "SynthWave Pro",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "neon-blue"
  },
  {
    title: "Retro Runner",
    artist: "Digital Dreams",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "neon-pink"
  },
  {
    title: "Cyber City",
    artist: "Future Beats",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "neon-green"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = PLAYLIST[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrackIndex, isPlaying]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      switch (e.key.toLowerCase()) {
        case 'p':
          togglePlay();
          break;
        case 'm':
          setVolume(v => v > 0 ? 0 : 0.5);
          break;
        case 'l':
          nextTrack();
          break;
        case 'k':
          prevTrack();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentTrackIndex]);

  return (
    <div className="w-full max-w-[400px] bg-black border-4 border-[#ff00ff] p-6 md:p-8 shadow-[0_0_30px_rgba(255,0,255,0.2)] relative overflow-hidden group font-mono">
      {/* Decorative Corner Brackets */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-[#00ffff] z-30" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-[#00ffff] z-30" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-[#00ffff] z-30" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-[#00ffff] z-30" />
      
      {/* Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_2px,3px_100%]" />

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={nextTrack}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
      
      <div className="flex items-center gap-6 mb-8 relative z-10">
        <div className="relative">
          <motion.div 
            animate={isPlaying ? { rotate: 360, scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="absolute inset-0 bg-[#00ffff] blur-xl opacity-20" 
          />
          <div className="w-16 h-16 bg-black border-2 border-[#00ffff] flex items-center justify-center shadow-[0_0_15px_rgba(0,255,255,0.3)] relative z-10 group-hover:border-[#ff00ff] transition-colors">
            <Music className={`w-8 h-8 text-[#00ffff] glow-blue ${isPlaying ? 'animate-pulse' : ''}`} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[#00ffff] font-black truncate tracking-tight text-xl mb-1 glitch-text" data-text={currentTrack.title.toUpperCase()}>
            {currentTrack.title.toUpperCase()}
          </h3>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-[#ff00ff] animate-ping" />
            <p className="text-[#ff00ff] text-[10px] uppercase tracking-[0.3em] truncate opacity-70">
              {currentTrack.artist.toUpperCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 mb-8 relative z-10">
        <div className="flex justify-between text-[10px] text-[#00ffff]/60 uppercase tracking-widest">
          <span className="bg-[#00ffff]/10 px-1">{formatTime(currentTime)}</span>
          <span className="bg-[#ff00ff]/10 px-1">{formatTime(duration)}</span>
        </div>
        <div className="h-4 bg-[#00ffff]/5 border-2 border-[#00ffff]/20 relative overflow-hidden group/progress">
          <div 
            className="absolute top-0 left-0 h-full bg-[#00ffff] shadow-[0_0_15px_#00ffff] transition-all duration-100"
            style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
          />
          {/* Glitchy progress indicator */}
          <motion.div 
            className="absolute top-0 h-full w-1 bg-[#ff00ff] z-20 shadow-[0_0_10px_#ff00ff]"
            style={{ left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            animate={isPlaying ? { opacity: [1, 0.5, 1] } : {}}
            transition={{ repeat: Infinity, duration: 0.2 }}
          />
          <input 
            type="range" 
            min="0" 
            max={duration || 0}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-8 md:gap-12 mb-10 relative z-10">
        <button 
          onClick={prevTrack} 
          title="Previous [K]"
          className="text-[#00ffff]/40 hover:text-[#00ffff] transition-all active:scale-90 hover:scale-110"
        >
          <SkipBack className="w-8 h-8 fill-current" />
        </button>
        <button 
          onClick={togglePlay}
          title="Play/Pause [P]"
          className="group relative w-20 h-20 bg-[#ff00ff] text-black flex items-center justify-center hover:bg-[#00ffff] transition-all active:scale-95 shadow-[0_0_30px_rgba(255,0,255,0.4)]"
        >
          {isPlaying ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-1" />}
          {/* Pulsing ring */}
          <div className="absolute inset-[-4px] border-2 border-[#ff00ff] animate-ping opacity-20" />
        </button>
        <button 
          onClick={nextTrack} 
          title="Next [L]"
          className="text-[#00ffff]/40 hover:text-[#ff00ff] transition-all active:scale-90 hover:scale-110"
        >
          <SkipForward className="w-8 h-8 fill-current" />
        </button>
      </div>

      <div className="space-y-6 relative z-10">
        <div className="flex items-center gap-5">
          <button 
            onClick={() => setVolume(v => v > 0 ? 0 : 0.5)}
            title="Mute [M]"
            className="text-[#00ffff]/40 hover:text-[#00ffff] transition-colors"
          >
            <Volume2 className={`w-5 h-5 ${volume === 0 ? 'text-[#ff00ff]' : ''}`} />
          </button>
          <div className="flex-1 h-3 bg-[#00ffff]/5 border border-[#00ffff]/20 relative overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#00ffff] to-[#ff00ff] transition-all duration-300"
              style={{ width: `${volume * 100}%` }}
            />
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
          </div>
          <span className="text-[10px] text-[#00ffff]/60 w-10 text-right bg-[#00ffff]/5 px-1">
            {Math.round(volume * 100)}%
          </span>
        </div>

        {/* Visualizer Bars - Pixelated Style */}
        <div className="flex items-end justify-between h-12 px-2 gap-[2px]">
          {Array.from({ length: 32 }).map((_, i) => (
            <motion.div
              key={i}
              className={`w-2 ${i % 2 === 0 ? 'bg-[#00ffff]' : 'bg-[#ff00ff]'}`}
              animate={isPlaying ? {
                height: [
                  `${10 + Math.random() * 90}%`,
                  `${10 + Math.random() * 90}%`,
                  `${10 + Math.random() * 90}%`
                ],
                opacity: [0.3, 1, 0.3]
              } : { height: '10%', opacity: 0.2 }}
              transition={{
                repeat: Infinity,
                duration: 0.3 + Math.random() * 0.4,
                ease: "linear"
              }}
            />
          ))}
        </div>
      </div>

      {/* System Status Label */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[6px] text-[#00ffff]/20 uppercase tracking-[1em] whitespace-nowrap">
        AUDIO_STREAM_STABLE // BUFFER_OK
      </div>
    </div>
  );
}
