import React, { useRef, useState, useEffect } from 'react';

const AudioPlayer = ({ musicData, isAudioPlaying, onPlay, onPause, onEnd }) => {
    const audioRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const toggleAudioPlayback = () => {
        if (!audioRef.current) return;
        
        if (isAudioPlaying) {
            audioRef.current.pause();
            if (onPause) onPause();
        } else {
            audioRef.current.play();
            if (onPlay) onPlay();
        }
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

    const handleSeek = (e) => {
        if (!audioRef.current) return;
        const seekTime = (e.nativeEvent.offsetX / e.target.offsetWidth) * duration;
        audioRef.current.currentTime = seekTime;
        setCurrentTime(seekTime);
    };

    const handleVolumeChange = (e) => {
        if (audioRef.current) {
            audioRef.current.volume = parseFloat(e.target.value);
        }
    };

    const formatTime = (seconds) => {
        if (isNaN(seconds)) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        let interval;
        if (isAudioPlaying) {
            interval = setInterval(() => {
                if (audioRef.current) {
                    setCurrentTime(audioRef.current.currentTime);
                }
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isAudioPlaying]);

    useEffect(() => {
        setCurrentTime(0);
        setDuration(0);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            if (onPause) onPause();
        }
    }, [musicData, onPause]);

    if (!musicData?.url) return null;

    return (
        <>
            <audio 
                ref={audioRef}
                src={musicData.url}
                onEnded={() => {
                    if (onEnd) onEnd();
                    else if (onPause) onPause();
                }}
                onPause={() => {
                    if (onPause) onPause();
                }}
                onPlay={() => {
                    if (onPlay) onPlay();
                }}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                className="hidden"
            />
            
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <button
                        onClick={toggleAudioPlayback}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    >
                        {isAudioPlaying ? (
                            <span className="text-lg">⏸</span>
                        ) : (
                            <span className="text-lg ml-1">▶</span>
                        )}
                    </button>
                    <div className="flex-1 mx-3">
                        <div 
                            className="h-1 bg-blue-200 rounded-full overflow-hidden cursor-pointer"
                            onClick={handleSeek}
                        >
                            <div 
                                className="h-full bg-blue-500 transition-all duration-100"
                                style={{ 
                                    width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' 
                                }}
                            />
                        </div>
                    </div>
                    <div className="text-xs text-gray-500 min-w-[80px] text-right">
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                </div>
                
                {/* Volume control */}
                <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm">Volume:</span>
                    <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.1"
                        defaultValue="0.7"
                        onChange={handleVolumeChange}
                        className="flex-1 h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                    />
                </div>
            </div>
        </>
    );
};

export default AudioPlayer;