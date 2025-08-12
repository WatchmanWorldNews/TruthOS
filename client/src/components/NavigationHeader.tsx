import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

export default function NavigationHeader() {
  const { user } = useAuth();

  const isPremium = user?.subscriptionStatus === 'premium_monthly' || user?.subscriptionStatus === 'premium_annual';

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 
              className="text-2xl font-bold text-primary-600 cursor-pointer"
              onClick={() => window.location.href = "/"}
              data-testid="link-home"
            >
              Mindful
            </h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a 
                href="/" 
                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
                data-testid="link-discover"
              >
                Discover
              </a>
              <a 
                href="/library" 
                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
                data-testid="link-library"
              >
                My Library
              </a>
              <a 
                href="#" 
                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
                data-testid="link-challenges"
              >
                Challenges
              </a>
              <a 
                href="#" 
                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
                data-testid="link-community"
              >
                Community
              </a>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {!isPremium && (
              <Button 
                onClick={() => window.location.href = "/subscribe"}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-full text-sm font-medium"
                data-testid="button-upgrade"
              >
                Upgrade to Premium
              </Button>
            )}
            
            {isPremium && (
              <Badge className="bg-amber-500 text-white">Premium</Badge>
            )}

            {/* Profile */}
            <div className="relative">
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full"
                  data-testid="img-profile"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  <i className="fas fa-user text-xs"></i>
                </div>
              )}
            </div>

            {/* Logout */}
            <Button
              variant="ghost"
              onClick={() => window.location.href = "/api/logout"}
              className="text-gray-700 hover:text-gray-900"
              data-testid="button-logout"
            >
              <i className="fas fa-sign-out-alt"></i>
            </Button>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-gray-700 hover:text-primary-600">
                <i className="fas fa-bars text-lg"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
