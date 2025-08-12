import { useState, useEffect, useRef } from "react";
import { useParams } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Session as SessionType, UserFavorite } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Session() {
  const { id } = useParams();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(10); // Default 10 minutes
  const [selectedGuide, setSelectedGuide] = useState("sarah");
  const [backgroundMusic, setBackgroundMusic] = useState("forest");
  const [journalEntry, setJournalEntry] = useState("");
  const [showJournal, setShowJournal] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  const { data: session, error: sessionError } = useQuery<SessionType>({
    queryKey: ["/api/sessions", id],
    enabled: !!id,
  });

  const { data: isFavorite } = useQuery({
    queryKey: ["/api/favorites", id],
    queryFn: async () => {
      const favorites = await fetch("/api/favorites").then(res => res.json());
      return favorites.some((fav: any) => fav.sessionId === id);
    },
    enabled: !!id && isAuthenticated,
  });

  const playSessionMutation = useMutation({
    mutationFn: async (data: { progressMinutes: number; isCompleted: boolean }) => {
      return apiRequest("POST", `/api/sessions/${id}/play`, data);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
      }
    },
  });

  const favoriteMutation = useMutation({
    mutationFn: async (action: "add" | "remove") => {
      const method = action === "add" ? "POST" : "DELETE";
      return apiRequest(method, `/api/favorites/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites", id] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
      }
    },
  });

  const journalMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest("POST", "/api/journal", {
        sessionId: id,
        content,
        mood: "peaceful"
      });
    },
    onSuccess: () => {
      toast({
        title: "Journal Entry Saved",
        description: "Your reflection has been saved.",
      });
      setJournalEntry("");
      setShowJournal(false);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
      }
    },
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  useEffect(() => {
    if (sessionError && isUnauthorizedError(sessionError)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [sessionError, toast]);

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    } else {
      setIsPlaying(true);
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const newTime = prev + 1;
          if (newTime >= duration * 60) {
            setIsPlaying(false);
            setShowJournal(true);
            playSessionMutation.mutate({ progressMinutes: duration, isCompleted: true });
            return duration * 60;
          }
          return newTime;
        });
      }, 1000);
    }
  };

  const handleSessionComplete = () => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setShowJournal(true);
    playSessionMutation.mutate({ progressMinutes: Math.ceil(currentTime / 60), isCompleted: true });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated || !session) {
    return null;
  }

  const progressPercentage = (currentTime / (duration * 60)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10"
            onClick={() => window.history.back()}
            data-testid="button-back"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back
          </Button>
          
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10"
            onClick={() => favoriteMutation.mutate(isFavorite ? "remove" : "add")}
            disabled={favoriteMutation.isPending}
            data-testid="button-favorite"
          >
            <i className={`fas fa-heart mr-2 ${isFavorite ? 'text-red-400' : ''}`}></i>
            {isFavorite ? 'Favorited' : 'Add to Favorites'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
          <CardContent className="p-8">
            {/* Session Info */}
            <div className="text-center mb-8">
              <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden">
                <img 
                  src={session.imageUrl || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&h=400"} 
                  alt={session.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h1 className="text-3xl font-bold mb-2">{session.title}</h1>
              <p className="text-primary-100 mb-4">{session.description}</p>
              
              <div className="flex items-center justify-center space-x-6 text-sm">
                <span><i className="fas fa-user mr-2"></i>{session.guideName}</span>
                <span><i className="fas fa-clock mr-2"></i>{duration} minutes</span>
                {session.isPremium && <Badge className="bg-amber-500">Premium</Badge>}
              </div>
            </div>

            {/* Session Customization */}
            <div className="mb-8">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Duration</label>
                  <Select onValueChange={(value) => setDuration(parseInt(value))} value={duration.toString()}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white" data-testid="select-duration">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 minute</SelectItem>
                      <SelectItem value="3">3 minutes</SelectItem>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="10">10 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Guide Voice</label>
                  <Select onValueChange={setSelectedGuide} value={selectedGuide}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white" data-testid="select-guide">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sarah">Sarah Chen - Calm & Soothing</SelectItem>
                      <SelectItem value="michael">Michael Torres - Deep & Resonant</SelectItem>
                      <SelectItem value="emma">Emma Johnson - Warm & Encouraging</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Background</label>
                  <Select onValueChange={setBackgroundMusic} value={backgroundMusic}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white" data-testid="select-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="forest">Forest Sounds</SelectItem>
                      <SelectItem value="ocean">Ocean Waves</SelectItem>
                      <SelectItem value="rain">Rain & Thunder</SelectItem>
                      <SelectItem value="piano">Ambient Piano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Player Controls */}
            <div className="text-center mb-8">
              <Button
                size="lg"
                onClick={handlePlayPause}
                className="w-20 h-20 rounded-full bg-white text-primary-600 hover:bg-gray-100 text-2xl"
                data-testid="button-play-pause"
              >
                <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
              </Button>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span data-testid="text-current-time">{formatTime(currentTime)}</span>
                <span data-testid="text-total-time">{formatTime(duration * 60)}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={handleSessionComplete}
                disabled={!isPlaying && currentTime === 0}
                data-testid="button-complete"
              >
                Complete Session
              </Button>
              
              <Dialog open={showJournal} onOpenChange={setShowJournal}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                    data-testid="button-journal"
                  >
                    <i className="fas fa-book mr-2"></i>
                    Journal
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white">
                  <DialogHeader>
                    <DialogTitle>Reflect on Your Practice</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      How was your meditation? Take a moment to reflect on your experience.
                    </p>
                    <Textarea
                      placeholder="Share your thoughts, feelings, or insights..."
                      value={journalEntry}
                      onChange={(e) => setJournalEntry(e.target.value)}
                      rows={4}
                      data-testid="textarea-journal"
                    />
                    <div className="flex justify-end space-x-3">
                      <Button
                        variant="outline"
                        onClick={() => setShowJournal(false)}
                        data-testid="button-journal-cancel"
                      >
                        Skip
                      </Button>
                      <Button
                        onClick={() => journalMutation.mutate(journalEntry)}
                        disabled={!journalEntry.trim() || journalMutation.isPending}
                        data-testid="button-journal-save"
                      >
                        Save Entry
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
