import { useState, useEffect } from 'react';
import { X, Trophy, Target, Medal, Shield, ArrowLeft, MessageCircle, UserPlus } from 'lucide-react';
import { User, BOT_USERS, POSITIONS, getScoreColor, getReliabilityBadge } from '@/lib/data';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileComments } from '../ProfileComments';
import { ProfileMatchHistory } from '../ProfileMatchHistory';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface UserProfileModalProps {
  userId: string;
  onClose: () => void;
  onUserClick?: (userId: string) => void;
}

interface DatabaseProfile {
  id: string;
  user_id: string;
  name: string | null;
  handle: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  bio: string | null;
  position: string | null;
  qors_score: number | null;
  reliability: string | null;
  matches_played: number | null;
  goals: number | null;
  assists: number | null;
  mvp_count: number | null;
  fair_play_badge: boolean | null;
}

export function UserProfileModal({ userId, onClose, onUserClick }: UserProfileModalProps) {
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<DatabaseProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Check if this is a bot user
  const botUser = BOT_USERS.find(u => u.id === userId);

  useEffect(() => {
    if (botUser) {
      setLoading(false);
      return;
    }
    
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (newUserId: string) => {
    if (newUserId !== userId && onUserClick) {
      onUserClick(newUserId);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-card w-full max-w-2xl rounded-2xl border border-border p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Render bot user profile
  if (botUser) {
    const positionConfig = POSITIONS[botUser.position];
    const reliabilityBadge = getReliabilityBadge(botUser.reliability);

    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-card w-full max-w-2xl max-h-[90vh] rounded-2xl border border-border shadow-card overflow-hidden animate-scale-in relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="overflow-y-auto max-h-[90vh] scrollbar-thin">
            {/* Cover */}
            <div className="relative h-40">
              <img
                src={botUser.cover}
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
            </div>

            {/* Profile Info */}
            <div className="px-6 -mt-14 relative z-10">
              <div className="flex items-end gap-4">
                <div className="relative">
                  <img
                    src={botUser.avatar}
                    alt={botUser.name}
                    className="w-24 h-24 rounded-2xl object-cover ring-4 ring-card shadow-card"
                  />
                  {botUser.fairPlayBadge && (
                    <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-glow">
                      <Shield className="w-3.5 h-3.5 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-bold">{botUser.name}</h2>
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", positionConfig.className)}>
                      {positionConfig.labelTr}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{botUser.handle}</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-surface rounded-xl">
                  <Trophy className="w-4 h-4 text-gold" />
                  <span className={cn("text-xl font-bold", getScoreColor(botUser.qorsScore))}>
                    {botUser.qorsScore.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Bio */}
              {botUser.bio && (
                <p className="mt-4 text-sm text-muted-foreground">{botUser.bio}</p>
              )}

              {/* Stats */}
              <div className="grid grid-cols-4 gap-2 mt-4">
                <div className="p-3 bg-surface rounded-xl text-center">
                  <p className="text-lg font-bold">{botUser.matchesPlayed}</p>
                  <p className="text-xs text-muted-foreground">Maç</p>
                </div>
                <div className="p-3 bg-surface rounded-xl text-center">
                  <p className="text-lg font-bold flex items-center justify-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-gold" />
                    {botUser.stats.mvp}
                  </p>
                  <p className="text-xs text-muted-foreground">MVP</p>
                </div>
                <div className="p-3 bg-surface rounded-xl text-center">
                  <p className="text-lg font-bold flex items-center justify-center gap-1">
                    <Target className="w-3.5 h-3.5 text-primary" />
                    {botUser.stats.goals}
                  </p>
                  <p className="text-xs text-muted-foreground">Gol</p>
                </div>
                <div className="p-3 bg-surface rounded-xl text-center">
                  <p className="text-lg font-bold flex items-center justify-center gap-1">
                    <Medal className="w-3.5 h-3.5 text-info" />
                    {botUser.stats.assists}
                  </p>
                  <p className="text-xs text-muted-foreground">Asist</p>
                </div>
              </div>

              {/* Followers */}
              <div className="flex items-center gap-4 mt-4 text-sm">
                <span><strong>{botUser.followers}</strong> <span className="text-muted-foreground">Takipçi</span></span>
                <span><strong>{botUser.following}</strong> <span className="text-muted-foreground">Takip</span></span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4 pb-4">
                <Button className="flex-1">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Takip Et
                </Button>
                <Button variant="outline" className="flex-1">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Mesaj
                </Button>
              </div>
            </div>

            {/* Comments Section - Bot users don't have database comments */}
            <div className="border-t border-border p-4">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Bu bir demo profilidir
              </h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render real user profile
  if (!profile) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-card w-full max-w-2xl rounded-2xl border border-border p-8 text-center">
          <p className="text-muted-foreground">Kullanıcı bulunamadı</p>
          <Button onClick={onClose} className="mt-4">Kapat</Button>
        </div>
      </div>
    );
  }

  const position = (profile.position as 'goalkeeper' | 'defender' | 'midfielder' | 'forward') || 'midfielder';
  const positionConfig = POSITIONS[position];
  const reliabilityBadge = getReliabilityBadge(profile.reliability || 'Yeni');
  const isCurrentUser = currentUser?.id === userId;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card w-full max-w-2xl max-h-[90vh] rounded-2xl border border-border shadow-card overflow-hidden animate-scale-in relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto max-h-[90vh] scrollbar-thin">
          {/* Cover */}
          <div className="relative h-40">
            <img
              src={profile.cover_url || 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?auto=format&fit=crop&q=80&w=1200'}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
          </div>

          {/* Profile Info */}
          <div className="px-6 -mt-14 relative z-10">
            <div className="flex items-end gap-4">
              <div className="relative">
                <img
                  src={profile.avatar_url || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200'}
                  alt={profile.name || 'User'}
                  className="w-24 h-24 rounded-2xl object-cover ring-4 ring-card shadow-card"
                />
                {profile.fair_play_badge && (
                  <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-glow">
                    <Shield className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold">{profile.name || 'Kullanıcı'}</h2>
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", positionConfig.className)}>
                    {positionConfig.labelTr}
                  </span>
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", reliabilityBadge.bg, reliabilityBadge.color)}>
                    {profile.reliability || 'Yeni'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{profile.handle || '@kullanici'}</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-surface rounded-xl">
                <Trophy className="w-4 h-4 text-gold" />
                <span className={cn("text-xl font-bold", getScoreColor(profile.qors_score || 5))}>
                  {(profile.qors_score || 5).toFixed(1)}
                </span>
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <p className="mt-4 text-sm text-muted-foreground">{profile.bio}</p>
            )}

            {/* Stats */}
            <div className="grid grid-cols-4 gap-2 mt-4">
              <div className="p-3 bg-surface rounded-xl text-center">
                <p className="text-lg font-bold">{profile.matches_played || 0}</p>
                <p className="text-xs text-muted-foreground">Maç</p>
              </div>
              <div className="p-3 bg-surface rounded-xl text-center">
                <p className="text-lg font-bold flex items-center justify-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-gold" />
                  {profile.mvp_count || 0}
                </p>
                <p className="text-xs text-muted-foreground">MVP</p>
              </div>
              <div className="p-3 bg-surface rounded-xl text-center">
                <p className="text-lg font-bold flex items-center justify-center gap-1">
                  <Target className="w-3.5 h-3.5 text-primary" />
                  {profile.goals || 0}
                </p>
                <p className="text-xs text-muted-foreground">Gol</p>
              </div>
              <div className="p-3 bg-surface rounded-xl text-center">
                <p className="text-lg font-bold flex items-center justify-center gap-1">
                  <Medal className="w-3.5 h-3.5 text-info" />
                  {profile.assists || 0}
                </p>
                <p className="text-xs text-muted-foreground">Asist</p>
              </div>
            </div>

            {/* Action Buttons */}
            {!isCurrentUser && (
              <div className="flex gap-3 mt-4 pb-4">
                <Button className="flex-1">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Takip Et
                </Button>
                <Button variant="outline" className="flex-1">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Mesaj
                </Button>
              </div>
            )}
          </div>

          {/* Match History */}
          <ProfileMatchHistory userId={userId} />

          {/* Comments Section */}
          <ProfileComments profileUserId={userId} onUserClick={handleUserClick} />
        </div>
      </div>
    </div>
  );
}
