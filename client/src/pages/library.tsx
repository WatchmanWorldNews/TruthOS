import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import NavigationHeader from "@/components/NavigationHeader";
import CategoryGrid from "@/components/CategoryGrid";
import SessionCard from "@/components/SessionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Library() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: categories, error: categoriesError } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: sessions, error: sessionsError } = useQuery({
    queryKey: ["/api/sessions", selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory) {
        params.append('categoryId', selectedCategory);
      }
      params.append('limit', '50');
      
      const response = await fetch(`/api/sessions?${params}`);
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      return response.json();
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
    const errors = [categoriesError, sessionsError].filter(Boolean);
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
  }, [categoriesError, sessionsError, toast]);

  const filteredSessions = sessions?.filter((session: any) =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.guideName.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Meditation Library</h1>
          <p className="text-lg text-gray-600">Discover thousands of guided meditations and mindfulness practices</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Search sessions, guides, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              data-testid="input-search"
            />
          </div>
          <Select onValueChange={setSelectedCategory} value={selectedCategory}>
            <SelectTrigger className="w-full sm:w-48" data-testid="select-category">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories?.map((category: any) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Categories */}
        {categories && !selectedCategory && !searchQuery && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Browse by Category</h2>
            <CategoryGrid categories={categories} />
          </section>
        )}

        {/* Sessions Grid */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {selectedCategory ? 
                `${categories?.find((c: any) => c.id === selectedCategory)?.name || 'Category'} Sessions` : 
                searchQuery ? 
                  `Search Results for "${searchQuery}"` :
                  'All Sessions'
              }
            </h2>
            <span className="text-sm text-gray-500" data-testid="text-session-count">
              {filteredSessions.length} sessions
            </span>
          </div>

          {filteredSessions.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-search text-4xl text-gray-300 mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery ? 
                  "Try adjusting your search terms or browse our categories." :
                  "No sessions available in this category."
                }
              </p>
              {(selectedCategory || searchQuery) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory("");
                    setSearchQuery("");
                  }}
                  data-testid="button-clear-filters"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSessions.map((session: any) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          )}
        </section>

        {/* Load More */}
        {filteredSessions.length > 0 && filteredSessions.length >= 50 && (
          <div className="text-center mt-12">
            <Button
              variant="outline"
              className="px-8"
              data-testid="button-load-more"
            >
              Load More Sessions
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
