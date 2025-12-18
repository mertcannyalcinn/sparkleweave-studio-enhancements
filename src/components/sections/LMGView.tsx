import { useState } from 'react';
import { AlertCircle, MapPin, Clock, Users, Filter, ChevronRight } from 'lucide-react';
import { SAMPLE_POSTS, Post } from '@/lib/data';
import { cn } from '@/lib/utils';
import { JoinMatchModal, JoinMatchData } from '@/components/modals/JoinMatchModal';
import { toast } from '@/hooks/use-toast';

interface LMGViewProps {
  onCreateMatch: () => void;
  onUserClick?: (userId: string) => void;
}

export function LMGView({ onCreateMatch, onUserClick }: LMGViewProps) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  
  const lmgPosts = SAMPLE_POSTS.filter(p => p.category === 'lmg' || p.urgency === 'Acil');

  const handleJoinClick = (post: Post) => {
    setSelectedPost(post);
    setIsJoinModalOpen(true);
  };

  const handleJoinSubmit = (data: JoinMatchData) => {
    console.log('Join match data:', data);
    toast({
      title: "Başvurun gönderildi!",
      description: `${selectedPost?.user} seninle iletişime geçecek.`,
    });
  };

  return (
    <div className="p-8 animate-fade-in">
      {/* Join Match Modal */}
      <JoinMatchModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        post={selectedPost}
        onSubmit={handleJoinSubmit}
      />

      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-urgent/10 rounded-xl flex items-center justify-center animate-pulse">
              <AlertCircle className="w-6 h-6 text-urgent" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">LMG - Son Dakika</h1>
              <p className="text-muted-foreground">Acil oyuncu arayanlar</p>
            </div>
          </div>
          <button
            onClick={onCreateMatch}
            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:shadow-glow transition-all"
          >
            + İlan Ver
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="max-w-4xl mx-auto mt-6">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium whitespace-nowrap">
            Tümü
          </button>
          <button className="px-4 py-2 bg-surface text-muted-foreground rounded-full text-sm font-medium hover:bg-surface-hover transition-colors whitespace-nowrap">
            Bugün
          </button>
          <button className="px-4 py-2 bg-surface text-muted-foreground rounded-full text-sm font-medium hover:bg-surface-hover transition-colors whitespace-nowrap">
            Yarın
          </button>
          <button className="px-4 py-2 bg-surface text-muted-foreground rounded-full text-sm font-medium hover:bg-surface-hover transition-colors whitespace-nowrap flex items-center gap-1">
            <Filter className="w-4 h-4" />
            Filtrele
          </button>
        </div>
      </div>

      {/* Posts */}
      <div className="max-w-4xl mx-auto mt-6 space-y-4">
        {lmgPosts.length === 0 ? (
          <div className="py-20 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-xl font-bold">Şu an acil ilan yok</p>
            <p className="text-muted-foreground mt-2">İlk ilanı sen oluştur!</p>
          </div>
        ) : (
          lmgPosts.map((post, index) => (
            <div
              key={post.id}
              className={cn(
                "p-5 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all animate-fade-in-up",
                post.urgency === 'Acil' && "border-urgent/30 bg-urgent/5",
                `stagger-${index + 1}`
              )}
            >
              {/* Urgent Badge */}
              {post.urgency === 'Acil' && (
                <div className="flex items-center gap-2 text-urgent mb-3">
                  <span className="w-2 h-2 bg-urgent rounded-full animate-pulse" />
                  <span className="text-sm font-bold">ACİL</span>
                </div>
              )}

              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => onUserClick?.(post.userId)}>
                    <img
                      src={post.avatar}
                      alt={post.user}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-border hover:ring-primary transition-all"
                    />
                  </button>
                  <div>
                    <button 
                      onClick={() => onUserClick?.(post.userId)}
                      className="font-semibold hover:text-primary transition-colors"
                    >
                      {post.user}
                    </button>
                    <p className="text-xs text-muted-foreground">{post.time}</p>
                  </div>
                </div>
                {post.price && (
                  <span className="px-4 py-2 bg-primary/10 text-primary rounded-xl font-bold">
                    {post.price}
                  </span>
                )}
              </div>

              {/* Content */}
              <h3 className="font-bold text-lg mt-3">{post.title}</h3>
              {post.description && (
                <p className="text-muted-foreground mt-2">{post.description}</p>
              )}

              {/* Details */}
              <div className="flex flex-wrap items-center gap-4 mt-4">
                {post.location && (
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-info" />
                    {post.location}
                  </span>
                )}
                {post.timeSpec && (
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 text-warning" />
                    {post.timeSpec}
                  </span>
                )}
              </div>

              {/* Action */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{post.comments.length} başvuru</span>
                </div>
                <button 
                  onClick={() => handleJoinClick(post)}
                  className="px-5 py-2 bg-primary text-primary-foreground rounded-xl font-semibold hover:shadow-glow transition-all flex items-center gap-2"
                >
                  Katıl
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
