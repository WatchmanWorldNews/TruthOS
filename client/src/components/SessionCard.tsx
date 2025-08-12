import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Session } from "@shared/schema";

interface SessionCardProps {
  session: Session;
}

export default function SessionCard({ session }: SessionCardProps) {
  const handleSessionClick = () => {
    window.location.href = `/session/${session.id}`;
  };

  return (
    <Card 
      className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
      onClick={handleSessionClick}
      data-testid={`card-session-${session.id}`}
    >
      <div className="relative">
        <img 
          src={session.imageUrl || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&h=240"} 
          alt={session.title}
          className="w-full h-48 object-cover rounded-t-xl" 
        />
        <div className="absolute top-4 right-4">
          <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors">
            <i className="fas fa-play text-sm"></i>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
          <span data-testid={`text-duration-${session.id}`}>{session.duration} min</span>
        </div>
        {session.isPremium && (
          <div className="absolute top-4 left-4 bg-amber-500 text-white px-2 py-1 rounded text-xs font-medium">
            <i className="fas fa-crown mr-1"></i>PREMIUM
          </div>
        )}
      </div>
      
      <CardContent className="p-6">
        <h4 className="font-semibold text-gray-900 mb-2" data-testid={`text-title-${session.id}`}>
          {session.title}
        </h4>
        {session.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2" data-testid={`text-description-${session.id}`}>
            {session.description}
          </p>
        )}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span data-testid={`text-guide-${session.id}`}>Guide: {session.guideName}</span>
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <i className="fas fa-play mr-1 text-gray-400"></i>
              <span data-testid={`text-plays-${session.id}`}>{session.plays}</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-heart mr-1 text-red-400"></i>
              <span data-testid={`text-likes-${session.id}`}>{session.likes}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
