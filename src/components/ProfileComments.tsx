import { useState, useEffect } from 'react';
import { Send, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface ProfileComment {
  id: string;
  profile_user_id: string;
  commenter_id: string;
  content: string;
  created_at: string;
  commenter_profile?: {
    name: string | null;
    avatar_url: string | null;
    handle: string | null;
  };
}

interface ProfileCommentsProps {
  profileUserId: string;
  onUserClick?: (userId: string) => void;
}

export function ProfileComments({ profileUserId, onUserClick }: ProfileCommentsProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<ProfileComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('profile-comments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profile_comments',
          filter: `profile_user_id=eq.${profileUserId}`
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profileUserId]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('profile_comments')
        .select('*')
        .eq('profile_user_id', profileUserId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch commenter profiles
      if (data && data.length > 0) {
        const commenterIds = [...new Set(data.map(c => c.commenter_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, name, avatar_url, handle')
          .in('user_id', commenterIds);

        const profileMap = new Map(profiles?.map(p => [p.user_id, p]));
        
        const commentsWithProfiles = data.map(comment => ({
          ...comment,
          commenter_profile: profileMap.get(comment.commenter_id) || null
        }));

        setComments(commentsWithProfiles);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('profile_comments')
        .insert({
          profile_user_id: profileUserId,
          commenter_id: user.id,
          content: newComment.trim()
        });

      if (error) throw error;
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('profile_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Şimdi';
    if (minutes < 60) return `${minutes} dk önce`;
    if (hours < 24) return `${hours} saat önce`;
    return `${days} gün önce`;
  };

  return (
    <div className="border-t border-border">
      <div className="p-4">
        <h3 className="text-sm font-semibold mb-4">Profil Yorumları</h3>

        {/* Comment Form */}
        {user && (
          <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Yorum yaz..."
              className="flex-1 px-4 py-2 bg-surface rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <Button 
              type="submit" 
              size="sm" 
              disabled={!newComment.trim() || submitting}
              className="px-3"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        )}

        {/* Comments List */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {loading ? (
            <div className="text-center py-4 text-muted-foreground text-sm">
              Yükleniyor...
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground text-sm">
              Henüz yorum yok
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 p-3 bg-surface rounded-xl">
                <button
                  onClick={() => onUserClick?.(comment.commenter_id)}
                  className="flex-shrink-0"
                >
                  <img
                    src={comment.commenter_profile?.avatar_url || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200'}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover hover:ring-2 hover:ring-primary transition-all"
                  />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => onUserClick?.(comment.commenter_id)}
                      className="font-medium text-sm hover:text-primary transition-colors truncate"
                    >
                      {comment.commenter_profile?.name || 'Kullanıcı'}
                    </button>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {formatTime(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5 break-words">
                    {comment.content}
                  </p>
                </div>
                {user?.id === comment.commenter_id && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="flex-shrink-0 p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
