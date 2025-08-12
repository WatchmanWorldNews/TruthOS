import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import NavigationHeader from "@/components/NavigationHeader";
import CategoryGrid from "@/components/CategoryGrid";
import SessionCard from "@/components/SessionCard";
import ProgressTracker from "@/components/ProgressTracker";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Home() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    refetchInterval: 30000,
  });

  const { data: featuredSessions, error: featuredError } = useQuery({
    queryKey: ["/api/sessions/featured"],
  });

  const { data: popularSessions, error: popularError } = useQuery({
    queryKey: ["/api/sessions/popular"],
  });

  const { data: categories, error: categoriesError } = useQuery({
    queryKey: ["/api/categories"],
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
    const errors = [featuredError, popularError, categoriesError].filter(Boolean);
    errors.forEach((error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
      }
    });
  }, [featuredError, popularError, categoriesError, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />

      {/* Welcome Hero */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              Welcome back, {user?.firstName || 'friend'}
            </h1>
            <p className="text-xl text-primary-100 mb-6">
              Ready to continue your mindfulness journey?
            </p>
            
            {stats && (
              <div className="flex justify-center items-center space-x-8 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white" data-testid="text-active-users">
                    {stats.activeUsers.toLocaleString()}
                  </div>
                  <div className="text-sm text-primary-200">Currently Meditating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white" data-testid="text-total-sessions">
                    {stats.totalSessions.toLocaleString()}+
                  </div>
                  <div className="text-sm text-primary-200">Guided Sessions</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Session */}
      {featuredSessions && featuredSessions[0] && (
        <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Today's Featured Practice</h2>
              <p className="text-gray-600">Curated daily content to support your mindfulness journey</p>
            </div>

            <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 max-w-4xl mx-auto shadow-lg border border-primary-100">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div>
                    <img 
                      src={featuredSessions[0].imageUrl || "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&h=400"} 
                      alt={featuredSessions[0].title}
                      className="rounded-xl w-full h-48 object-cover shadow-md" 
                    />
                  </div>
                  <div>
                    <Badge className="text-primary-600 font-medium text-sm mb-2">TODAY'S FEATURED</Badge>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{featuredSessions[0].title}</h3>
                    <p className="text-gray-600 mb-4 text-sm">{featuredSessions[0].description}</p>
                    
                    <div className="flex items-center space-x-4 mb-4 text-xs text-gray-500">
                      <span><i className="fas fa-clock mr-1"></i>{featuredSessions[0].duration} min</span>
                      <span><i className="fas fa-user mr-1"></i>{featuredSessions[0].guideName}</span>
                      <span><i className="fas fa-heart mr-1"></i>{featuredSessions[0].likes}</span>
                    </div>

                    <Button 
                      onClick={() => window.location.href = `/session/${featuredSessions[0].id}`}
                      className="bg-primary-600 hover:bg-primary-700 text-white"
                      data-testid="button-start-featured"
                    >
                      <i className="fas fa-play mr-2"></i>
                      Start Session
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Categories Grid */}
      {categories && (
        <section className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Explore Your Library</h2>
                <p className="text-gray-600">Choose from thousands of guided meditations and mindfulness practices</p>
              </div>
              <Button 
                variant="outline"
                onClick={() => window.location.href = "/library"}
                data-testid="button-view-all"
              >
                View All
              </Button>
            </div>

            <CategoryGrid categories={categories} />
          </div>
        </section>
      )}

      {/* Popular Sessions */}
      {popularSessions && (
        <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Popular This Week</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularSessions.slice(0, 6).map((session: any) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Progress Tracker */}
      <ProgressTracker user={user} stats={stats} />
    </div>
  );
}
