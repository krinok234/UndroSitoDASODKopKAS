import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, X, Music, Volume2, RefreshCw } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { convertFileSrc } from '@tauri-apps/api/core';
import { MusicTrack } from '../types';
import { clsx } from 'clsx';

export const MusicPlayer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [playlist, setPlaylist] = useState<MusicTrack[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const loadMusic = async () => {
    try {
      console.log("Scanning music...");
      const tracks = await invoke<MusicTrack[]>('scan_music', { path: 'C:\\Users\\pponc\\Desktop\\CosCraftDonate\\music' });
      console.log("Scanned tracks:", tracks);
      setPlaylist(tracks);
      if (tracks.length > 0) {
        if (!currentTrack) setCurrentTrack(tracks[0]);
      } else {
          console.warn("No tracks found in C:\\Users\\pponc\\Desktop\\CosCraftDonate\\music");
      }
    } catch (e) {
      console.error("Failed to scan music:", e);
    }
  };

  useEffect(() => {
    loadMusic();
  }, []);

  useEffect(() => {
    if (currentTrack && audioRef.current) {
        const url = convertFileSrc(currentTrack.path);
        audioRef.current.src = url;
        if (isPlaying) {
            audioRef.current.play().catch(e => console.error("Playback failed:", e));
        }
    }
  }, [currentTrack]);

  useEffect(() => {
      if(audioRef.current) {
          if(isPlaying) audioRef.current.play().catch(e => console.error("Playback failed:", e));
          else audioRef.current.pause();
      }
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const skipTime = (seconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime += seconds;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleTrackEnded = () => {
      // Play next track
      if (playlist.length > 0 && currentTrack) {
          const currentIndex = playlist.findIndex(t => t.path === currentTrack.path);
          const nextIndex = (currentIndex + 1) % playlist.length;
          setCurrentTrack(playlist[nextIndex]);
      }
  };

  const playNext = () => {
      if (playlist.length > 0 && currentTrack) {
          const currentIndex = playlist.findIndex(t => t.path === currentTrack.path);
          const nextIndex = (currentIndex + 1) % playlist.length;
          setCurrentTrack(playlist[nextIndex]);
      }
  };

  const playPrev = () => {
      if (playlist.length > 0 && currentTrack) {
          const currentIndex = playlist.findIndex(t => t.path === currentTrack.path);
          const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
          setCurrentTrack(playlist[prevIndex]);
      }
  };

  if (!isOpen) {
      return (
          <button 
            onClick={() => setIsOpen(true)}
            className="fixed bottom-4 right-4 bg-gradient-to-r from-glam-accent to-glam-primary text-white p-3 rounded-full shadow-lg hover:scale-110 transition-all z-50 animate-bounce"
          >
              <Music className="w-6 h-6" />
          </button>
      );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-glam-bg/90 backdrop-blur-md border-t border-glam-primary/30 p-4 z-50 transition-transform duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Track Info */}
        <div className="flex items-center gap-4 w-1/4 min-w-[200px]">
            <div className="w-12 h-12 bg-glam-primary/20 rounded-lg flex items-center justify-center border border-glam-primary/30">
                <Music className="w-6 h-6 text-glam-accent" />
            </div>
            <div className="overflow-hidden">
                <h4 className="font-bold text-white truncate">{currentTrack?.title || "Нет музыки"}</h4>
                <p className="text-xs text-glam-text/60 truncate">{currentTrack?.artist || "Загрузите mp3 в папку music"}</p>
            </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-2 flex-1">
            <div className="flex items-center gap-6">
                <button onClick={playPrev} className="text-glam-text/80 hover:text-white transition-colors">
                    <SkipBack className="w-5 h-5" />
                </button>
                <button 
                    onClick={() => skipTime(-5)}
                    className="text-xs text-glam-text/60 hover:text-white transition-colors"
                >
                    -5s
                </button>
                <button 
                    onClick={togglePlay}
                    className="w-10 h-10 bg-white text-glam-bg rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-white/20"
                >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>
                <button 
                    onClick={() => skipTime(5)}
                    className="text-xs text-glam-text/60 hover:text-white transition-colors"
                >
                    +5s
                </button>
                <button onClick={playNext} className="text-glam-text/80 hover:text-white transition-colors">
                    <SkipForward className="w-5 h-5" />
                </button>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full max-w-md flex items-center gap-2 text-xs text-glam-text/60 font-mono">
                <span>{formatTime(currentTime)}</span>
                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer" onClick={(e) => {
                    if (!audioRef.current || !currentTrack) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const percent = (e.clientX - rect.left) / rect.width;
                    audioRef.current.currentTime = percent * audioRef.current.duration;
                }}>
                    <div 
                        className="h-full bg-glam-accent transition-all duration-100"
                        style={{ width: `${audioRef.current ? (currentTime / audioRef.current.duration) * 100 : 0}%` }}
                    />
                </div>
                <span>{formatTime(currentTrack?.duration || 0)}</span>
            </div>
        </div>

        {/* Volume & Close */}
        <div className="flex items-center gap-4 w-1/4 justify-end">
            <div className="flex items-center gap-2 group">
                <Volume2 className="w-4 h-4 text-glam-text/60 group-hover:text-white transition-colors" />
                <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01" 
                    value={volume}
                    onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setVolume(val);
                        if(audioRef.current) audioRef.current.volume = val;
                    }}
                    className="w-20 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-glam-accent [&::-webkit-slider-thumb]:rounded-full"
                />
            </div>
            <button 
                onClick={loadMusic}
                className="p-2 text-glam-text/60 hover:text-white hover:bg-white/10 rounded-full transition-colors ml-4"
                title="Обновить список"
            >
                <RefreshCw className="w-4 h-4" />
            </button>
            <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-glam-text/60 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors ml-2"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
      </div>
      
      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />
    </div>
  );
};

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
