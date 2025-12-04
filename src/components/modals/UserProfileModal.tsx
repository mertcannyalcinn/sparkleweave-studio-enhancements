import { X } from 'lucide-react';
import { User, BOT_USERS } from '@/lib/data';
import { ProfileView } from '../ProfileView';

interface UserProfileModalProps {
  userId: string;
  onClose: () => void;
}

export function UserProfileModal({ userId, onClose }: UserProfileModalProps) {
  const user = BOT_USERS.find(u => u.id === userId);

  if (!user) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card w-full max-w-2xl max-h-[90vh] rounded-2xl border border-border shadow-card overflow-hidden animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Content */}
        <div className="overflow-y-auto max-h-[90vh] scrollbar-thin">
          <ProfileView
            user={user}
            onBack={onClose}
            isCurrentUser={false}
          />
        </div>
      </div>
    </div>
  );
}
