import { Card, CardContent } from "@/components/ui/card";

interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  sessionCount: number;
}

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  const getIconClass = (icon: string | undefined) => {
    switch (icon) {
      case 'heart': return 'fas fa-heart text-red-600';
      case 'moon': return 'fas fa-moon text-indigo-600';
      case 'bullseye': return 'fas fa-bullseye text-green-600';
      case 'hands-helping': return 'fas fa-hands-helping text-pink-600';
      case 'seedling': return 'fas fa-seedling text-purple-600';
      case 'leaf': return 'fas fa-leaf text-teal-600';
      case 'wind': return 'fas fa-wind text-blue-600';
      case 'walking': return 'fas fa-walking text-orange-600';
      default: return 'fas fa-circle text-gray-600';
    }
  };

  const getColorClass = (color: string | undefined) => {
    switch (color) {
      case 'red': return 'bg-red-100 group-hover:bg-red-200';
      case 'indigo': return 'bg-indigo-100 group-hover:bg-indigo-200';
      case 'green': return 'bg-green-100 group-hover:bg-green-200';
      case 'pink': return 'bg-pink-100 group-hover:bg-pink-200';
      case 'purple': return 'bg-purple-100 group-hover:bg-purple-200';
      case 'teal': return 'bg-teal-100 group-hover:bg-teal-200';
      case 'blue': return 'bg-blue-100 group-hover:bg-blue-200';
      case 'orange': return 'bg-orange-100 group-hover:bg-orange-200';
      default: return 'bg-gray-100 group-hover:bg-gray-200';
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    window.location.href = `/library?category=${categoryId}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {categories.map((category) => (
        <Card 
          key={category.id}
          className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
          onClick={() => handleCategoryClick(category.id)}
          data-testid={`card-category-${category.id}`}
        >
          <CardContent className="p-6">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${getColorClass(category.color)}`}>
              <i className={`${getIconClass(category.icon)} text-xl`}></i>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{category.sessionCount} sessions</p>
            {category.description && (
              <div className="text-xs text-gray-500">{category.description}</div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
