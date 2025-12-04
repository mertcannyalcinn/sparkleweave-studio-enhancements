import { Search, Plus, Grid3X3, Target, Zap, Shield, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CATEGORIES } from '@/lib/data';
import { Button } from './ui/button';

interface HeaderProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  onOpenModal: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  all: <Grid3X3 className="w-4 h-4" />,
  tactics: <Target className="w-4 h-4" />,
  highlights: <Zap className="w-4 h-4" />,
  defense: <Shield className="w-4 h-4" />,
  lmg: <AlertCircle className="w-4 h-4" />,
};

export function Header({
  activeCategory,
  setActiveCategory,
  onOpenModal,
  searchTerm,
  setSearchTerm,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 glass-effect">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              id="search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Gönderi, oyuncu veya takım ara..."
              className="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>

          {/* Create Match Button */}
          <Button
            onClick={onOpenModal}
            className="gap-2 px-5 py-3 h-auto rounded-xl font-semibold shadow-glow hover:shadow-hover transition-all"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Maç Oluştur</span>
          </Button>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto scrollbar-hide pb-1">
          {CATEGORIES.map((cat, index) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-300 animate-fade-in",
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "bg-surface text-muted-foreground hover:bg-surface-hover hover:text-foreground",
                `stagger-${index + 1}`
              )}
              style={{ opacity: 0, animationFillMode: 'forwards' }}
            >
              {categoryIcons[cat.id]}
              {cat.label}
              {cat.id === 'lmg' && (
                <span className="w-2 h-2 bg-urgent rounded-full animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
