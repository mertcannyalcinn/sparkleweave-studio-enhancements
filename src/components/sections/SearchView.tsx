import { Search, BookOpen, Video, Users, Target, Zap, Shield, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchViewProps {
  onCategorySelect: (category: string) => void;
}

const searchCategories = [
  { id: 'players', label: 'Oyuncular', icon: Users, color: 'bg-primary/10 text-primary' },
  { id: 'tactics', label: 'Taktikler', icon: Target, color: 'bg-info/10 text-info' },
  { id: 'highlights', label: 'Goller', icon: Zap, color: 'bg-gold/10 text-gold' },
  { id: 'matches', label: 'Maçlar', icon: Shield, color: 'bg-success/10 text-success' },
];

const trendingSearches = [
  '4-3-3 diziliş',
  'Kaleci antrenmanı',
  'Orta saha oyuncusu',
  'Penaltı teknikleri',
  'Halı saha taktikleri',
];

export function SearchView({ onCategorySelect }: SearchViewProps) {
  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Search className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Keşfet</h1>
            <p className="text-muted-foreground">Oyuncu, taktik ve maç bul</p>
          </div>
        </div>
      </div>

      {/* Search Categories */}
      <div className="max-w-2xl mx-auto mt-8">
        <h2 className="font-semibold mb-4">Kategoriler</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {searchCategories.map((cat, index) => (
            <button
              key={cat.id}
              onClick={() => onCategorySelect(cat.id)}
              className={cn(
                "p-4 rounded-xl border border-border hover:border-primary/50 transition-all flex flex-col items-center gap-2 animate-fade-in-up",
                `stagger-${index + 1}`
              )}
            >
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", cat.color)}>
                <cat.icon className="w-6 h-6" />
              </div>
              <span className="font-medium text-sm">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Trending Searches */}
      <div className="max-w-2xl mx-auto mt-8">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="font-semibold">Popüler Aramalar</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {trendingSearches.map((search, index) => (
            <button
              key={search}
              className="px-4 py-2 bg-surface rounded-full text-sm hover:bg-surface-hover hover:text-primary transition-all animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {search}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Content */}
      <div className="max-w-2xl mx-auto mt-8">
        <h2 className="font-semibold mb-4">Öne Çıkanlar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl border border-primary/20 hover:border-primary/50 transition-all cursor-pointer">
            <Video className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-bold mb-1">Haftalık En İyi Goller</h3>
            <p className="text-sm text-muted-foreground">Bu haftanın en güzel 10 golü</p>
          </div>
          <div className="p-6 bg-gradient-to-br from-gold/20 to-gold/5 rounded-2xl border border-gold/20 hover:border-gold/50 transition-all cursor-pointer">
            <BookOpen className="w-8 h-8 text-gold mb-3" />
            <h3 className="font-bold mb-1">Taktik Rehberi</h3>
            <p className="text-sm text-muted-foreground">Profesyonellerden öğren</p>
          </div>
        </div>
      </div>
    </div>
  );
}
