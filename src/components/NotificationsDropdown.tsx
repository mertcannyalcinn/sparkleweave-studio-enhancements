import { Bell, Heart, MessageCircle, Star, Trophy, Info, UserPlus } from 'lucide-react';
import { SAMPLE_NOTIFICATIONS, Notification } from '@/lib/data';
import { cn } from '@/lib/utils';

interface NotificationsDropdownProps {
  onOpenRating: () => void;
  onClose?: () => void;
  onPostClick?: (postId: string) => void;
  onUserClick?: (userId: string) => void;
}

const notificationIcons: Record<string, React.ReactNode> = {
  like: <Heart className="w-4 h-4 text-destructive" />,
  comment: <MessageCircle className="w-4 h-4 text-info" />,
  match_rating: <Star className="w-4 h-4 text-gold" />,
  match_star: <Trophy className="w-4 h-4 text-gold" />,
  system: <Info className="w-4 h-4 text-muted-foreground" />,
  follow: <UserPlus className="w-4 h-4 text-primary" />,
};

export function NotificationsDropdown({ onOpenRating, onClose, onPostClick, onUserClick }: NotificationsDropdownProps) {
  const unreadCount = SAMPLE_NOTIFICATIONS.filter(n => !n.isRead).length;

  const handleNotificationClick = (notification: Notification) => {
    // Handle different notification types
    switch (notification.type) {
      case 'match_rating':
        onOpenRating();
        break;
      case 'like':
      case 'comment':
        // Navigate to post if postId exists
        if (notification.postId && onPostClick) {
          onPostClick(notification.postId);
        }
        break;
      case 'follow':
        // Navigate to user profile if userId exists
        if (notification.userId && onUserClick) {
          onUserClick(notification.userId);
        }
        break;
      case 'match_star':
        // Could navigate to match history
        break;
      default:
        break;
    }
    onClose?.();
  };

  const handleAvatarClick = (e: React.MouseEvent, userId?: string) => {
    e.stopPropagation();
    if (userId && onUserClick) {
      onUserClick(userId);
      onClose?.();
    }
  };

  return (
    <div 
      className="absolute left-full ml-3 top-0 w-80 bg-card border border-border rounded-2xl shadow-card overflow-hidden z-50 animate-scale-in"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          <h3 className="font-bold">Bildirimler</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <button className="text-sm text-primary hover:underline">Tümünü Oku</button>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto scrollbar-thin">
        {SAMPLE_NOTIFICATIONS.map((notification, index) => (
          <button
            key={notification.id}
            onClick={() => handleNotificationClick(notification)}
            className={cn(
              "w-full p-4 flex items-start gap-3 border-b border-border/50 last:border-0 hover:bg-surface transition-colors text-left animate-fade-in group",
              !notification.isRead && "bg-primary/5"
            )}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {/* Icon or Avatar */}
            <div 
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                notification.avatar ? "cursor-pointer hover:ring-2 hover:ring-primary transition-all" : "bg-surface"
              )}
              onClick={(e) => handleAvatarClick(e, notification.userId)}
            >
              {notification.avatar ? (
                <img src={notification.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                notificationIcons[notification.type]
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                {notification.user && (
                  <span 
                    className="font-semibold hover:text-primary cursor-pointer"
                    onClick={(e) => handleAvatarClick(e, notification.userId)}
                  >
                    {notification.user}{' '}
                  </span>
                )}
                <span className={cn(!notification.isRead && "font-medium")}>{notification.message || notification.title}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
            </div>

            {/* Unread indicator */}
            {!notification.isRead && (
              <span className="w-2 h-2 bg-primary rounded-full shrink-0 mt-2" />
            )}

            {/* Action hint */}
            {(notification.postId || notification.userId) && (
              <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1">
                →
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <button className="w-full py-2 text-sm text-primary hover:bg-surface rounded-xl transition-colors">
          Tüm Bildirimleri Gör
        </button>
      </div>
    </div>
  );
}
