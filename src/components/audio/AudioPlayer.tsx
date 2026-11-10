import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, AlertCircle, Loader2, Music2 } from 'lucide-react';
import { AUDIO_RECITER, getSurahAudioUrl, getBackupSurahAudioUrl } from '../../services/quranService';

interface AudioPlayerProps {
  surahNumber: number;
  surahNameArabic: string;
  surahNameEnglish: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  surahNumber,
  surahNameArabic,
  surahNameEnglish,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [useBackup, setUseBackup] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);

  // Compute active audio URL based on primary or backup fallback
  const currentAudioUrl = useBackup
    ? getBackupSurahAudioUrl(surahNumber)
    : getSurahAudioUrl(surahNumber);

  // Stop and reset audio whenever the Surah changes (strictly NO autoplay on load)
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setIsLoading(false);
    setHasError(false);
    setUseBackup(false);
  }, [surahNumber]);

  // Audio event handlers
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsLoading(false);
      setHasError(false);
    }
  };

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  const handleWaiting = () => {
    setIsLoading(true);
  };

  const handlePlay = () => {
    setIsPlaying(true);
    setIsLoading(false);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleError = () => {
    setIsLoading(false);
    setIsPlaying(false);
    if (!useBackup) {
      // Try backup CDN once
      console.warn(`Primary audio failed for Surah ${surahNumber}, attempting backup source...`);
      setUseBackup(true);
    } else {
      setHasError(true);
    }
  };

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      try {
        setIsLoading(true);
        setHasError(false);
        await audio.play();
      } catch (err) {
        console.error('Audio playback failed:', err);
        setIsLoading(false);
        setIsPlaying(false);
        setHasError(true);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
      if (newVol > 0 && isMuted) {
        setIsMuted(false);
      }
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.muted = false;
      setIsMuted(false);
    } else {
      audioRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const handleRetry = () => {
    setHasError(false);
    setUseBackup(false);
    if (audioRef.current) {
      audioRef.current.load();
      togglePlay();
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-[#123D32] text-white rounded-xl p-4 sm:p-5 border border-[#1E6652]/70 shadow-xs">
      {/* Hidden standard HTML5 audio element */}
      <audio
        ref={audioRef}
        src={currentAudioUrl}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={handleCanPlay}
        onWaiting={handleWaiting}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onError={handleError}
      />

      <div className="flex flex-col gap-3.5">
        
        {/* Top Info Bar: Reciter & Surah */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E6652]/70 pb-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#1E6652] flex items-center justify-center text-[#B49352] shrink-0">
              <Music2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-semibold text-[#FAF8F3] block sm:inline">
                {AUDIO_RECITER.name}
              </span>
              <span className="text-[#FAF8F3]/60 hidden sm:inline"> · Full Recitation</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[#B49352] font-serif text-sm font-bold mr-1.5">
              {surahNameArabic}
            </span>
            <span className="text-[#FAF8F3]/70 text-xs">
              (Surah {surahNumber} · {surahNameEnglish})
            </span>
          </div>
        </div>

        {/* Error notification & retry action */}
        {hasError ? (
          <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-200 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>Audio recitation could not be loaded. Check connection.</span>
            </div>
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-800 hover:bg-red-700 text-white rounded text-xs font-medium cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </div>
        ) : (
          /* Controls & Seek Bar */
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            
            {/* Play/Pause Button */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={togglePlay}
                disabled={isLoading && !isPlaying}
                className="w-11 h-11 rounded-full bg-[#1E6652] hover:bg-[#1E6652]/85 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer border border-[#B49352]/40 shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B49352]"
                aria-label={isPlaying ? 'Pause Surah recitation' : 'Play Surah recitation'}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-[#B49352]" />
                ) : isPlaying ? (
                  <Pause className="w-5 h-5 fill-current text-[#FAF8F3]" />
                ) : (
                  <Play className="w-5 h-5 fill-current text-[#FAF8F3] ml-0.5" />
                )}
              </button>

              <div className="sm:hidden text-xs text-[#FAF8F3]/70 tabular-nums">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            {/* Seek Bar and Timestamps */}
            <div className="flex-1 flex items-center gap-3">
              <span className="hidden sm:inline-block text-xs text-[#FAF8F3]/75 tabular-nums min-w-[38px]">
                {formatTime(currentTime)}
              </span>

              <div className="relative flex-1 flex items-center">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={0.5}
                  value={currentTime}
                  onChange={handleSeek}
                  disabled={!duration || hasError}
                  aria-label="Recitation progress seek bar"
                  className="w-full h-1.5 bg-[#1E6652] rounded-lg appearance-none cursor-pointer accent-[#B49352] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B49352]"
                />
              </div>

              <span className="hidden sm:inline-block text-xs text-[#FAF8F3]/75 tabular-nums min-w-[38px] text-right">
                {formatTime(duration)}
              </span>
            </div>

            {/* Volume Control */}
            <div className="hidden lg:flex items-center gap-2 shrink-0 border-l border-[#1E6652]/70 pl-3">
              <button
                type="button"
                onClick={toggleMute}
                className="text-[#FAF8F3]/70 hover:text-white p-1 rounded cursor-pointer"
                aria-label={isMuted ? 'Unmute recitation' : 'Mute recitation'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-300" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                aria-label="Recitation volume"
                className="w-16 h-1 bg-[#1E6652] rounded-lg appearance-none cursor-pointer accent-[#B49352]"
              />
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
