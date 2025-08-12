import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { GlobalStats, Session } from "@shared/schema";

export default function Landing() {
  const { data: stats } = useQuery<GlobalStats>({
    queryKey: ["/api/stats"],
    refetchInterval: 30000, // Update every 30 seconds
  });

  const { data: featuredSessions } = useQuery<Session[]>({
    queryKey: ["/api/sessions/featured"],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">Mindful</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => window.location.href = "/api/login"}
                className="bg-primary-600 hover:bg-primary-700 text-white"
                data-testid="button-login"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Find Peace in Your Daily Life
              </h1>
              <p className="text-xl text-primary-100 mb-8 leading-relaxed">
                Join millions discovering calm, clarity, and inner peace through guided meditation, mindfulness practices, and daily reflections.
              </p>
              
              {/* Live Stats Counter */}
              {stats && (
                <div className="flex items-center space-x-8 mb-8">
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

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button 
                  onClick={() => window.location.href = "/api/login"}
                  className="bg-white text-primary-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50"
                  data-testid="button-start-trial"
                >
                  <i className="fas fa-play mr-2"></i>
                  Start Free Trial
                </Button>
                <Button 
                  variant="outline"
                  className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-primary-600"
                  data-testid="button-browse-library"
                >
                  Browse Library
                </Button>
              </div>
            </div>

            <div className="lg:text-right">
              <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Woman meditating in peaceful garden" 
                className="rounded-2xl shadow-2xl w-full max-w-md mx-auto" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Session */}
      {featuredSessions && featuredSessions[0] && (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Today's Featured Practice</h2>
              <p className="text-lg text-gray-600">Curated daily content to support your mindfulness journey</p>
            </div>

            <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 max-w-4xl mx-auto shadow-lg border border-primary-100">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <img 
                      src={featuredSessions[0].imageUrl || "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&h=400"} 
                      alt={featuredSessions[0].title}
                      className="rounded-xl w-full h-64 object-cover shadow-md" 
                    />
                  </div>
                  <div>
                    <Badge className="text-primary-600 font-medium text-sm mb-2">TODAY'S FEATURED</Badge>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{featuredSessions[0].title}</h3>
                    <p className="text-gray-600 mb-6">{featuredSessions[0].description}</p>
                    
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="flex items-center text-sm text-gray-500">
                        <i className="fas fa-clock mr-2"></i>
                        <span>{featuredSessions[0].duration} minutes</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <i className="fas fa-user mr-2"></i>
                        <span>{featuredSessions[0].guideName}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <i className="fas fa-heart mr-2"></i>
                        <span>{featuredSessions[0].likes} likes</span>
                      </div>
                    </div>

                    <Button 
                      onClick={() => window.location.href = "/api/login"}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-full font-semibold"
                      data-testid="button-start-session"
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

      {/* Subscription Plans */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Mindfulness Journey</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Get unlimited access to thousands of meditations, exclusive content, and advanced features</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="bg-gray-50 border-2 border-gray-200">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Free</h3>
                  <div className="text-4xl font-bold text-gray-900 mb-2">$0</div>
                  <p className="text-gray-600">Perfect to get started</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-3"></i>
                    <span className="text-gray-700">5 daily meditations</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-3"></i>
                    <span className="text-gray-700">Basic progress tracking</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-3"></i>
                    <span className="text-gray-700">7-day intro challenge</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-3"></i>
                    <span className="text-gray-700">Community access</span>
                  </li>
                </ul>
                
                <Button 
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white"
                  onClick={() => window.location.href = "/api/login"}
                  data-testid="button-free-plan"
                >
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Premium Monthly */}
            <Card className="bg-white border-2 border-primary-600 relative shadow-lg">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary-600 text-white px-6 py-2">Most Popular</Badge>
              </div>
              
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Monthly</h3>
                  <div className="text-4xl font-bold text-gray-900 mb-2">$9.99</div>
                  <p className="text-gray-600">per month</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-3"></i>
                    <span className="text-gray-700">10,000+ guided sessions</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-3"></i>
                    <span className="text-gray-700">Offline download</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-3"></i>
                    <span className="text-gray-700">50+ expert guides</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-3"></i>
                    <span className="text-gray-700">Customizable sessions</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-3"></i>
                    <span className="text-gray-700">Advanced progress tracking</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-3"></i>
                    <span className="text-gray-700">Premium sleep content</span>
                  </li>
                </ul>
                
                <Button 
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                  onClick={() => window.location.href = "/api/login"}
                  data-testid="button-monthly-plan"
                >
                  Start 7-Day Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* Premium Annual */}
            <Card className="bg-gradient-to-br from-primary-50 to-secondary-50 border-2 border-primary-200">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Annual</h3>
                  <div className="text-4xl font-bold text-gray-900 mb-2">$69.99</div>
                  <p className="text-gray-600">per year</p>
                  <Badge className="bg-green-100 text-green-800 mt-2">Save $50/year</Badge>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-3"></i>
                    <span className="text-gray-700">Everything in Monthly</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-3"></i>
                    <span className="text-gray-700">Early access to new content</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-3"></i>
                    <span className="text-gray-700">Priority customer support</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-crown text-amber-500 mr-3"></i>
                    <span className="text-gray-700">Exclusive annual member perks</span>
                  </li>
                </ul>
                
                <Button 
                  className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white"
                  onClick={() => window.location.href = "/api/login"}
                  data-testid="button-annual-plan"
                >
                  Start 7-Day Free Trial
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8 text-sm text-gray-600">
            <p>All plans include a 7-day free trial. Cancel anytime. No commitment.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="col-span-1 lg:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-4">Mindful</h3>
              <p className="text-gray-300 mb-6 max-w-md">
                Your companion for daily mindfulness, meditation, and inner peace. Join millions discovering calm in their everyday lives.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">How it Works</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-300 text-sm">
            <p>© 2024 Mindful. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
