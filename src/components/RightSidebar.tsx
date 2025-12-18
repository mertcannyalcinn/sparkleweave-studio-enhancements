import { TrendingUp, Users, Calendar, Star, Trophy, ChevronRight } from 'lucide-react';
import { BOT_USERS, TRENDING_TOPICS, UPCOMING_MATCHES, getScoreColor, POSITIONS } from '@/lib/data';
import { cn } from '@/lib/utils';

interface RightSidebarProps {
  onUserClick?: (userId: string) => void;
}

export function RightSidebar({ onUserClick }: RightSidebarProps) {
  const topPlayers = BOT_USERS.slice(0, 5).sort((a, b) => b.qorsScore - a.qorsScore);

  return (
    <aside className="w-80 bg-card border-l border-border p-5 overflow-y-auto scrollbar-thin hidden xl:block">
      {/* Trending */}
      <div className="mb-6 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-bold">Gündem</h3>
        </div>
        <div className="space-y-2">
          {TRENDING_TOPICS.map((topic, i) => (
            <button
              key={i}
              className="w-full flex items-center justify-between p-3 bg-surface rounded-xl hover:bg-surface-hover transition-all group"
            >
              <span className="font-medium text-primary group-hover:translate-x-1 transition-transform">{topic.tag}</span>
              <span className="text-xs text-muted-foreground">{topic.posts} gönderi</span>
            </button>
          ))}
        </div>
      </div>

      {/* Top Players */}
      <div className="mb-6 animate-fade-in stagger-2">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center">
            <Trophy className="w-4 h-4 text-gold" />
          </div>
          <h3 className="font-bold">En İyi Oyuncular</h3>
        </div>
        <div className="space-y-2">
          {topPlayers.map((player, i) => (
            <button
              key={player.id}
              onClick={() => onUserClick?.(player.id)}
              className="w-full flex items-center gap-3 p-3 bg-surface rounded-xl hover:bg-surface-hover transition-all group"
            >
              <div className="relative">
                <span className={cn(
                  "absolute -top-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold",
                  i === 0 ? "bg-gold text-background" : i === 1 ? "bg-platinum text-background" : "bg-muted text-foreground"
                )}>
                  {i + 1}
                </span>
                <img
                  src={player.avatar}
                  alt={player.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-border group-hover:ring-primary transition-all"
                />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-sm group-hover:text-primary transition-colors">{player.name}</p>
                <p className="text-xs text-muted-foreground">{POSITIONS[player.position].labelTr}</p>
              </div>
              <div className={cn("font-bold text-sm", getScoreColor(player.qorsScore))}>
                {player.qorsScore.toFixed(1)}
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
            </button>
          ))}
        </div>
      </div>

      {/* Upcoming Matches */}
      <div className="animate-fade-in stagger-3">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-info/10 rounded-lg flex items-center justify-center">
            <Calendar className="w-4 h-4 text-info" />
          </div>
          <h3 className="font-bold">Yaklaşan Maçlar</h3>
        </div>
        <div className="space-y-3">
          {UPCOMING_MATCHES.map((match, i) => (
            <div
              key={i}
              className="p-4 bg-surface rounded-xl border border-border hover:border-primary/50 transition-all cursor-pointer"
            >
              <p className="font-semibold text-sm">{match.teams}</p>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {match.time}
                </span>
                <span>{match.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Qors © {new Date().getFullYear()} • Tüm hakları saklıdır
        </p>
      </div>
    </aside>
  );
}
