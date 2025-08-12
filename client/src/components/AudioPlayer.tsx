import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface AudioPlayerProps {
  session: {
    id: string;
    title: string;
    guideName: string;
    imageUrl?: string;
  };
  isVisible: boolean;
  onClose: () => void;
}

export default function AudioPlayer({ session, isVisible, onClose }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(204); // 3:24 in seconds
  const [totalTime] = useState(600); // 10:00 in seconds
  const [isFavorite, setIsFavorite] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (currentTime / totalTime) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalTime) {
            setIsPlaying(false);
            return totalTime;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalTime]);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-white shadow-xl border-t border-gray-200 z-40 transform transition-transform duration-300"
      style={{ transform: isVisible ? 'translateY(0)' : 'translateY(100%)' }}
      data-testid="audio-player"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Session thumbnail */}
            <img 
              src={session.imageUrl || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=80&h=80"} 
              alt={session.title}
              className="w-16 h-16 rounded-lg object-cover" 
            />
            
            <div>
              <h4 className="font-semibold text-gray-900" data-testid="text-session-title">
                {session.title}
              </h4>
              <p className="text-sm text-gray-600" data-testid="text-session-guide">
                Guide: {session.guideName}
              </p>
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex items-center space-x-6">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-gray-600 hover:text-primary-600"
              data-testid="button-previous"
            >
              <i className="fas fa-step-backward text-lg"></i>
            </Button>
            
            <Button
              size="lg"
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-full"
              data-testid="button-play-pause"
            >
              <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-lg`}></i>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="text-gray-600 hover:text-primary-600"
              data-testid="button-next"
            >
              <i className="fas fa-step-forward text-lg"></i>
            </Button>
          </div>

          {/* Progress and Time */}
          <div className="hidden lg:flex items-center space-x-4">
            <span className="text-sm text-gray-500" data-testid="text-current-time">
              {formatTime(currentTime)}
            </span>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-500" data-testid="text-total-time">
              {formatTime(totalTime)}
            </span>
          </div>

          {/* Additional Controls */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFavorite(!isFavorite)}
              className={`transition-colors ${isFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-600 hover:text-primary-600'}`}
              data-testid="button-favorite"
            >
              <i className="fas fa-heart text-lg"></i>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-primary-600"
              data-testid="button-settings"
            >
              <i className="fas fa-cog text-lg"></i>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800"
              data-testid="button-close"
            >
              <i className="fas fa-times text-lg"></i>
            </Button>
          </div>
        </div>

        {/* Mobile Progress Bar */}
        <div className="lg:hidden mt-3">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span data-testid="text-current-time-mobile">{formatTime(currentTime)}</span>
            <span data-testid="text-total-time-mobile">{formatTime(totalTime)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
