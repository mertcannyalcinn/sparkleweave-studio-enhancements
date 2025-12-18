import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Target, Medal, Shield, Calendar, Star, MessageCircle, UserPlus, Settings, MapPin, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileComments } from '@/components/ProfileComments';
import { ProfileMatchHistory } from '@/components/ProfileMatchHistory';
import { Button } from '@/components/ui/button';
import { BOT_USERS, POSITIONS, getScoreColor, getReliabilityBadge, SAMPLE_POSTS } from '@/lib/data';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

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

interface Rating {
  id: string;
  average_rating: number;
  comment: string | null;
  created_at: string;
  rater_profile?: {
    name: string | null;
    avatar_url: string | null;
  };
}

export default function Profile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser, loading: authLoading } = useAuth();
  
  const [profile, setProfile] = useState<DatabaseProfile | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if this is a bot user
  const botUser = BOT_USERS.find(u => u.id === userId);
  const botPosts = botUser ? SAMPLE_POSTS.filter(p => p.userId === botUser.id) : [];

  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate('/auth');
      return;
    }
    
    if (botUser) {
      setLoading(false);
      return;
    }
    
    if (userId) {
      fetchProfile();
      fetchRatings();
    }
  }, [userId, currentUser, authLoading]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRatings = async () => {
    try {
      const { data, error } = await supabase
        .from('player_ratings')
        .select('id, average_rating, comment, created_at, rater_id')
        .eq('rated_user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      if (data && data.length > 0) {
        const raterIds = [...new Set(data.map(r => r.rater_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, name, avatar_url')
          .in('user_id', raterIds);

        const profileMap = new Map(profiles?.map(p => [p.user_id, p]));
        
        const ratingsWithProfiles = data.map(rating => ({
          ...rating,
          rater_profile: profileMap.get(rating.rater_id) || null
        }));

        setRatings(ratingsWithProfiles);
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  const handleStartConversation = async () => {
    if (!currentUser || !userId) return;
    
    try {
      // Check if conversation exists
      const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(participant_1.eq.${currentUser.id},participant_2.eq.${userId}),and(participant_1.eq.${userId},participant_2.eq.${currentUser.id})`)
        .maybeSingle();

      if (existing) {
        navigate(`/messages/${existing.id}`);
        return;
      }

      // Create new conversation
      const { data: newConv, error } = await supabase
        .from('conversations')
        .insert({
          participant_1: currentUser.id,
          participant_2: userId
        })
        .select('id')
        .single();

      if (error) throw error;
      navigate(`/messages/${newConv.id}`);
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error('Mesaj başlatılamadı');
    }
  };

  const isCurrentUser = currentUser?.id === userId;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  // Render bot user profile
  if (botUser) {
    const positionConfig = POSITIONS[botUser.position];
    const reliabilityBadge = getReliabilityBadge(botUser.reliability);

    return (
      <div className="min-h-screen bg-background">
        {/* Cover */}
        <div className="relative h-48 md:h-64">
          <img
            src={botUser.cover}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="max-w-4xl mx-auto px-6 -mt-16 relative z-10">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="relative">
              <img
                src={botUser.avatar}
                alt={botUser.name}
                className="w-28 h-28 rounded-2xl object-cover ring-4 ring-background shadow-card"
              />
              {botUser.fairPlayBadge && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-glow">
                  <Shield className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold">{botUser.name}</h1>
                <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", positionConfig.className)}>
                  {positionConfig.labelTr}
                </span>
                <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", reliabilityBadge.bg, reliabilityBadge.color)}>
                  {botUser.reliability}
                </span>
              </div>
              <p className="text-muted-foreground">{botUser.handle}</p>
            </div>

            <div className="flex items-center gap-2 px-4 py-3 bg-card rounded-xl border border-border">
              <Trophy className="w-5 h-5 text-gold" />
              <div>
                <p className="text-xs text-muted-foreground">QORS Puanı</p>
                <p className={cn("text-2xl font-bold", getScoreColor(botUser.qorsScore))}>
                  {botUser.qorsScore.toFixed(1)}
                </p>
              </div>
            </div>
          </div>

          {/* Bio */}
          {botUser.bio && (
            <p className="mt-4 text-muted-foreground">{botUser.bio}</p>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <div className="p-4 bg-card rounded-xl border border-border text-center">
              <p className="text-2xl font-bold">{botUser.matchesPlayed}</p>
              <p className="text-xs text-muted-foreground mt-1">Maç</p>
            </div>
            <div className="p-4 bg-card rounded-xl border border-border text-center">
              <div className="flex items-center justify-center gap-1">
                <Trophy className="w-4 h-4 text-gold" />
                <p className="text-2xl font-bold">{botUser.stats.mvp}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">MVP</p>
            </div>
            <div className="p-4 bg-card rounded-xl border border-border text-center">
              <div className="flex items-center justify-center gap-1">
                <Target className="w-4 h-4 text-primary" />
                <p className="text-2xl font-bold">{botUser.stats.goals}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Gol</p>
            </div>
            <div className="p-4 bg-card rounded-xl border border-border text-center">
              <div className="flex items-center justify-center gap-1">
                <Medal className="w-4 h-4 text-info" />
                <p className="text-2xl font-bold">{botUser.stats.assists}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Asist</p>
            </div>
          </div>

          {/* Followers */}
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <span className="font-bold">{botUser.followers}</span>
              <span className="text-muted-foreground text-sm">Takipçi</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">{botUser.following}</span>
              <span className="text-muted-foreground text-sm">Takip</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <Button className="flex-1">
              <UserPlus className="w-4 h-4 mr-2" />
              Takip Et
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => toast.info('Demo kullanıcılarına mesaj gönderilemez')}>
              <MessageCircle className="w-4 h-4 mr-2" />
              Mesaj Gönder
            </Button>
          </div>

          {/* Posts Section */}
          {botPosts.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Paylaşımlar
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {botPosts.map((post) => (
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

          {/* Demo Notice */}
          <div className="mt-8 p-4 bg-surface rounded-xl border border-border">
            <p className="text-sm text-muted-foreground text-center">
              Bu bir demo profilidir
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render real user profile
  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Kullanıcı bulunamadı</p>
          <Button onClick={() => navigate(-1)} className="mt-4">Geri Dön</Button>
        </div>
      </div>
    );
  }

  const position = (profile.position as 'goalkeeper' | 'defender' | 'midfielder' | 'forward') || 'midfielder';
  const positionConfig = POSITIONS[position];
  const reliabilityBadge = getReliabilityBadge(profile.reliability || 'Yeni');

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Cover */}
      <div className="relative h-48 md:h-64">
        <img
          src={profile.cover_url || 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?auto=format&fit=crop&q=80&w=1200'}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {isCurrentUser && (
          <button
            onClick={() => toast.info('Profil düzenleme yakında!')}
            className="absolute top-4 right-4 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-16 relative z-10">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="relative">
            <img
              src={profile.avatar_url || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200'}
              alt={profile.name || 'User'}
              className="w-28 h-28 rounded-2xl object-cover ring-4 ring-background shadow-card"
            />
            {profile.fair_play_badge && (
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-glow">
                <Shield className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold">{profile.name || 'Kullanıcı'}</h1>
              <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", positionConfig.className)}>
                {positionConfig.labelTr}
              </span>
              <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", reliabilityBadge.bg, reliabilityBadge.color)}>
                {profile.reliability || 'Yeni'}
              </span>
            </div>
            <p className="text-muted-foreground">{profile.handle || '@kullanici'}</p>
          </div>

          <div className="flex items-center gap-2 px-4 py-3 bg-card rounded-xl border border-border">
            <Trophy className="w-5 h-5 text-gold" />
            <div>
              <p className="text-xs text-muted-foreground">QORS Puanı</p>
              <p className={cn("text-2xl font-bold", getScoreColor(profile.qors_score || 5))}>
                {(profile.qors_score || 5).toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="mt-4 text-muted-foreground">{profile.bio}</p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          <div className="p-4 bg-card rounded-xl border border-border text-center">
            <p className="text-2xl font-bold">{profile.matches_played || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Maç</p>
          </div>
          <div className="p-4 bg-card rounded-xl border border-border text-center">
            <div className="flex items-center justify-center gap-1">
              <Trophy className="w-4 h-4 text-gold" />
              <p className="text-2xl font-bold">{profile.mvp_count || 0}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">MVP</p>
          </div>
          <div className="p-4 bg-card rounded-xl border border-border text-center">
            <div className="flex items-center justify-center gap-1">
              <Target className="w-4 h-4 text-primary" />
              <p className="text-2xl font-bold">{profile.goals || 0}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Gol</p>
          </div>
          <div className="p-4 bg-card rounded-xl border border-border text-center">
            <div className="flex items-center justify-center gap-1">
              <Medal className="w-4 h-4 text-info" />
              <p className="text-2xl font-bold">{profile.assists || 0}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Asist</p>
          </div>
        </div>

        {/* Action Buttons */}
        {!isCurrentUser && (
          <div className="flex gap-3 mt-6">
            <Button className="flex-1">
              <UserPlus className="w-4 h-4 mr-2" />
              Takip Et
            </Button>
            <Button variant="outline" className="flex-1" onClick={handleStartConversation}>
              <MessageCircle className="w-4 h-4 mr-2" />
              Mesaj Gönder
            </Button>
          </div>
        )}

        {/* Match History */}
        <div className="mt-8 bg-card rounded-2xl border border-border overflow-hidden">
          <ProfileMatchHistory userId={userId!} />
        </div>

        {/* Ratings Section */}
        {ratings.length > 0 && (
          <div className="mt-8 bg-card rounded-2xl border border-border p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-gold" />
              Aldığı Puanlar
            </h2>
            <div className="space-y-3">
              {ratings.map((rating) => (
                <div key={rating.id} className="p-4 bg-surface rounded-xl">
                  <div className="flex items-center gap-3">
                    <img
                      src={rating.rater_profile?.avatar_url || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200'}
                      alt="Rater"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{rating.rater_profile?.name || 'Kullanıcı'}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(rating.created_at).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <div className={cn("text-lg font-bold", getScoreColor(rating.average_rating))}>
                      {rating.average_rating.toFixed(1)}
                    </div>
                  </div>
                  {rating.comment && (
                    <p className="mt-2 text-sm text-muted-foreground">{rating.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Profile Comments */}
        <div className="mt-8 bg-card rounded-2xl border border-border overflow-hidden">
          <ProfileComments 
            profileUserId={userId!} 
            onUserClick={(id) => navigate(`/profile/${id}`)} 
          />
        </div>
      </div>
    </div>
  );
}
