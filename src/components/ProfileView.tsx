import { X, ArrowLeft, Trophy, Target, Medal, Shield, MapPin, Users, Calendar, Edit3 } from 'lucide-react';
import { User, Post, POSITIONS, getScoreColor, getReliabilityBadge } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface ProfileViewProps {
  user: User;
  posts?: Post[];
  onBack: () => void;
  onEditProfile?: () => void;
  isCurrentUser?: boolean;
}

export function ProfileView({ user, posts = [], onBack, onEditProfile, isCurrentUser = false }: ProfileViewProps) {
  const positionConfig = POSITIONS[user.position];
  const reliabilityBadge = getReliabilityBadge(user.reliability);

  return (
    <div className="animate-fade-in">
      {/* Cover */}
      <div className="relative h-48 md:h-56">
        <img
          src={user.cover}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Edit Button */}
        {isCurrentUser && onEditProfile && (
          <button
            onClick={onEditProfile}
            className="absolute top-4 right-4 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full flex items-center gap-2 hover:bg-background transition-colors text-sm font-medium"
          >
            <Edit3 className="w-4 h-4" />
            Düzenle
          </button>
        )}
      </div>

      {/* Profile Info */}
      <div className="px-6 -mt-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          {/* Avatar */}
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-28 h-28 rounded-2xl object-cover ring-4 ring-background shadow-card"
            />
            {user.fairPlayBadge && (
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-glow">
                <Shield className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
          </div>

          {/* Name & Handle */}
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", positionConfig.className)}>
                {positionConfig.labelTr}
              </span>
              <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", reliabilityBadge.bg, reliabilityBadge.color)}>
                {user.reliability}
              </span>
            </div>
            <p className="text-muted-foreground">{user.handle}</p>
          </div>

          {/* QORS Score */}
          <div className="flex items-center gap-2 px-4 py-3 bg-card rounded-xl border border-border">
            <Trophy className="w-5 h-5 text-gold" />
            <div>
              <p className="text-xs text-muted-foreground">QORS Puanı</p>
              <p className={cn("text-2xl font-bold", getScoreColor(user.qorsScore))}>
                {user.qorsScore.toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="mt-4 text-muted-foreground">{user.bio}</p>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          <div className="p-4 bg-card rounded-xl border border-border text-center">
            <p className="text-2xl font-bold text-foreground">{user.matchesPlayed}</p>
            <p className="text-xs text-muted-foreground mt-1">Maç</p>
          </div>
          <div className="p-4 bg-card rounded-xl border border-border text-center">
            <div className="flex items-center justify-center gap-1">
              <Trophy className="w-4 h-4 text-gold" />
              <p className="text-2xl font-bold text-foreground">{user.stats.mvp}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">MVP</p>
          </div>
          <div className="p-4 bg-card rounded-xl border border-border text-center">
            <div className="flex items-center justify-center gap-1">
              <Target className="w-4 h-4 text-primary" />
              <p className="text-2xl font-bold text-foreground">{user.stats.goals}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Gol</p>
          </div>
          <div className="p-4 bg-card rounded-xl border border-border text-center">
            <div className="flex items-center justify-center gap-1">
              <Medal className="w-4 h-4 text-info" />
              <p className="text-2xl font-bold text-foreground">{user.stats.assists}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Asist</p>
          </div>
        </div>

        {/* Followers/Following */}
        {(user.followers !== undefined || user.following !== undefined) && (
          <div className="flex items-center gap-6 mt-4">
            {user.followers !== undefined && (
              <div className="flex items-center gap-2">
                <span className="font-bold">{user.followers}</span>
                <span className="text-muted-foreground text-sm">Takipçi</span>
              </div>
            )}
            {user.following !== undefined && (
              <div className="flex items-center gap-2">
                <span className="font-bold">{user.following}</span>
                <span className="text-muted-foreground text-sm">Takip</span>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons (for other users) */}
        {!isCurrentUser && (
          <div className="flex gap-3 mt-6">
            <Button className="flex-1">Takip Et</Button>
            <Button variant="outline" className="flex-1">Mesaj Gönder</Button>
          </div>
        )}
      </div>

      {/* Saved Posts Section */}
      {posts.length > 0 && (
        <div className="px-6 py-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Kaydedilen Gönderiler
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="aspect-square bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all cursor-pointer"
              >
                {post.thumbnail ? (
                  <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-4 text-center text-sm text-muted-foreground">
                    {post.title.substring(0, 50)}...
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
