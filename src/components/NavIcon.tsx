import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavIconProps {
  icon: LucideIcon;
  label: string;
  id: string;
  activeNav: string;
  onClick: (id: string) => void;
  badge?: number;
}

export function NavIcon({ icon: Icon, label, id, activeNav, onClick, badge }: NavIconProps) {
  const isActive = activeNav === id;

  return (
    <button
      onClick={() => onClick(id)}
      className={cn(
        "group relative w-full flex justify-center py-3 transition-all duration-300",
        isActive && "nav-active"
      )}
      title={label}
    >
      <div
        className={cn(
          "w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300",
          isActive
            ? "bg-primary text-primary-foreground shadow-glow scale-110"
            : "bg-surface-elevated text-muted-foreground hover:bg-surface-hover hover:text-foreground hover:scale-105"
        )}
      >
        <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
      </div>
      
      {/* Badge */}
      {badge && badge > 0 && (
        <span className="absolute top-1 right-4 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center animate-bounce-subtle">
          {badge > 9 ? '9+' : badge}
        </span>
      )}

      {/* Tooltip */}
      <span className="absolute left-full ml-3 px-3 py-1.5 bg-card text-foreground text-sm font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-card z-50">
        {label}
      </span>
    </button>
  );
}
