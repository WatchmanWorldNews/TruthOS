import { Card, CardContent } from "@/components/ui/card";
import { User, GlobalStats } from "@shared/schema";

interface ProgressTrackerProps {
  user?: User;
  stats?: GlobalStats;
}

export default function ProgressTracker({ user, stats }: ProgressTrackerProps) {
  if (!user) return null;

  return (
    <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Progress Stats */}
          <div>
            <h2 className="text-3xl font-bold mb-8">Track Your Mindfulness Journey</h2>
            
            {/* Personal Stats */}
            <Card className="bg-white bg-opacity-10 backdrop-blur border-white/20 text-white mb-8">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6">Your Progress</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white" data-testid="text-user-streak">
                      {user.currentStreak || 0}
                    </div>
                    <div className="text-primary-200 text-sm">Day Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white" data-testid="text-user-minutes">
                      {(user.totalMinutes || 0).toLocaleString()}
                    </div>
                    <div className="text-primary-200 text-sm">Minutes Meditated</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white" data-testid="text-user-sessions">
                      {user.sessionsCompleted || 0}
                    </div>
                    <div className="text-primary-200 text-sm">Sessions Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white" data-testid="text-user-badges">
                      {user.badgesEarned || 0}
                    </div>
                    <div className="text-primary-200 text-sm">Badges Earned</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Community Stats */}
            {stats && (
              <Card className="bg-white bg-opacity-10 backdrop-blur border-white/20 text-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-6">Global Community</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>People meditating now</span>
                      <span className="font-bold text-2xl" data-testid="text-community-active">
                        {stats.activeUsers.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Total minutes today</span>
                      <span className="font-bold text-2xl" data-testid="text-community-minutes">
                        {(stats.totalMinutes / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Community members</span>
                      <span className="font-bold text-2xl" data-testid="text-community-members">
                        {(stats.activeUsers / 10).toFixed(0)}K
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Journey Visualization */}
          <div className="text-center">
            <img 
              src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=600&h=600" 
              alt="Person meditating with peaceful expression showing progress" 
              className="rounded-2xl shadow-2xl w-full max-w-md mx-auto mb-8" 
            />
            
            {/* Achievement Badges */}
            <div className="flex justify-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                <i className="fas fa-fire text-white text-lg"></i>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <i className="fas fa-leaf text-white text-lg"></i>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <i className="fas fa-mountain text-white text-lg"></i>
              </div>
            </div>
            
            <p className="text-primary-100 text-lg">
              Join millions on their journey to inner peace and mindfulness
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
