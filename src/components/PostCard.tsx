import { useState } from 'react';
import { Heart, MessageCircle, Bookmark, MoreHorizontal, Trash2, Play, MapPin, Clock, Users, AlertCircle, Eye } from 'lucide-react';
import { Post, formatViews, getScoreColor, BOT_USERS } from '@/lib/data';
import { CommentSection } from './CommentSection';
import { cn } from '@/lib/utils';

interface PostCardProps {
  post: Post;
  currentUserId: string;
  onLike: () => void;
  onSave: () => void;
  onDelete: () => void;
  onApply?: () => void;
  onAddComment: (text: string) => void;
  onUserClick?: (userId: string) => void;
}

export function PostCard({
  post,
  currentUserId,
  onLike,
  onSave,
  onDelete,
  onApply,
  onAddComment,
  onUserClick,
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const isOwner = post.userId === currentUserId;

  const handleUserClick = () => {
    if (onUserClick) {
      onUserClick(post.userId);
    }
  };

  const renderContent = () => {
    switch (post.type) {
      case 'video':
        return (
          <div className="relative group rounded-xl overflow-hidden">
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-glow transform scale-90 group-hover:scale-100 transition-transform">
                <Play className="w-8 h-8 text-primary-foreground ml-1" />
              </div>
            </div>
            {post.views && (
              <span className="absolute bottom-3 right-3 px-2.5 py-1 bg-background/80 backdrop-blur-sm rounded-lg text-xs font-medium flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {formatViews(post.views)}
              </span>
            )}
          </div>
        );

      case 'lineup':
        return (
          <div className="p-4 bg-surface rounded-xl border border-border">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <span className="font-bold text-primary">{post.formation}</span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{post.description}</p>
            {post.tags && (
              <div className="flex flex-wrap gap-2 mt-3">
                {post.tags.map((tag, i) => (
                  <span key={i} className="px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        );

      case 'transfer':
        return (
          <div className="p-4 bg-gradient-to-br from-surface to-card rounded-xl border border-border space-y-3">
            {post.urgency === 'Acil' && (
              <div className="flex items-center gap-2 text-urgent animate-pulse">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-bold">ACİL</span>
              </div>
            )}
            <p className="text-sm text-muted-foreground">{post.description}</p>
            <div className="flex flex-wrap gap-3 text-sm">
              {post.location && (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-info" />
                  {post.location}
                </span>
              )}
              {post.timeSpec && (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="w-4 h-4 text-warning" />
                  {post.timeSpec}
                </span>
              )}
            </div>
            {post.price && (
              <div className="inline-flex items-center px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-bold">
                {post.price}
              </div>
            )}
          </div>
        );

      default:
        return post.thumbnail ? (
          <div className="rounded-xl overflow-hidden">
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        ) : null;
    }
  };

  return (
    <article className="bg-card rounded-2xl border border-border overflow-hidden card-hover animate-fade-in-up">
      {/* Header */}
      <div className="p-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <button onClick={handleUserClick} className="relative group">
            <img
              src={post.avatar}
              alt={post.user}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-border group-hover:ring-primary transition-all"
            />
            <div className={cn(
              "absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold",
              getScoreColor(post.qorsScore),
              "bg-card border-2 border-card"
            )}>
              {post.qorsScore.toFixed(1)}
            </div>
          </button>
          <div>
            <button onClick={handleUserClick} className="font-semibold hover:text-primary transition-colors flex items-center gap-2">
              {post.user}
              {post.badge && (
                <span className="text-xs">{post.badge}</span>
              )}
            </button>
            <p className="text-xs text-muted-foreground">{post.time}</p>
          </div>
        </div>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 rounded-full hover:bg-surface flex items-center justify-center transition-colors"
          >
            <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-40 bg-popover/95 backdrop-blur-xl border border-border rounded-xl shadow-card overflow-hidden z-20 animate-scale-in">
              {isOwner && (
                <button
                  onClick={() => { onDelete(); setShowMenu(false); }}
                  className="w-full px-4 py-3 flex items-center gap-2 text-destructive hover:bg-destructive/10 transition-colors text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Sil
                </button>
              )}
              <button
                onClick={() => { onSave(); setShowMenu(false); }}
                className="w-full px-4 py-3 flex items-center gap-2 hover:bg-surface transition-colors text-sm"
              >
                <Bookmark className="w-4 h-4" />
                {post.isSaved ? 'Kayıttan Çıkar' : 'Kaydet'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4">
        <p className="text-foreground mb-3 leading-relaxed">{post.title}</p>
        {renderContent()}
      </div>

      {/* Actions */}
      <div className="p-4 flex items-center justify-between border-t border-border mt-4">
        <div className="flex items-center gap-1">
          <button
            onClick={onLike}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all",
              post.isLiked ? "text-destructive bg-destructive/10" : "text-muted-foreground hover:bg-surface hover:text-foreground"
            )}
          >
            <Heart className={cn("w-5 h-5", post.isLiked && "fill-current")} />
            <span className="text-sm font-medium">{post.likes}</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-muted-foreground hover:bg-surface hover:text-foreground transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{post.comments.length}</span>
          </button>
          <button
            onClick={onSave}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all",
              post.isSaved ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-surface hover:text-foreground"
            )}
          >
            <Bookmark className={cn("w-5 h-5", post.isSaved && "fill-current")} />
          </button>
        </div>

        {onApply && post.type === 'transfer' && (
          <button
            onClick={onApply}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:shadow-glow transition-all"
          >
            Katıl
          </button>
        )}
      </div>

      {/* Comments */}
      {showComments && (
        <CommentSection
          comments={post.comments}
          onAddComment={onAddComment}
          onUserClick={onUserClick}
        />
      )}
    </article>
  );
}
