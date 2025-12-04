import { useState } from 'react';
import { Send } from 'lucide-react';
import { Comment } from '@/lib/data';

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (text: string) => void;
  onUserClick?: (userId: string) => void;
}

export function CommentSection({ comments, onAddComment, onUserClick }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = () => {
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  return (
    <div className="border-t border-border animate-fade-in">
      {/* Comments List */}
      <div className="max-h-60 overflow-y-auto scrollbar-thin">
        {comments.length === 0 ? (
          <p className="p-4 text-center text-muted-foreground text-sm">Henüz yorum yok. İlk yorumu sen yap!</p>
        ) : (
          comments.map((comment, index) => (
            <div key={comment.id} className="p-4 flex gap-3 border-b border-border/50 last:border-0 animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
              <button onClick={() => onUserClick?.(comment.userId)}>
                <img
                  src={comment.avatar}
                  alt={comment.user}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-border hover:ring-primary transition-all"
                />
              </button>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <button 
                    onClick={() => onUserClick?.(comment.userId)}
                    className="font-semibold text-sm hover:text-primary transition-colors"
                  >
                    {comment.user}
                  </button>
                  <span className="text-xs text-muted-foreground">{comment.time}</span>
                </div>
                <p className="text-sm text-foreground/90 mt-1">{comment.text}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Comment */}
      <div className="p-4 flex gap-3 bg-surface/50">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Yorum yaz..."
          className="flex-1 px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
        />
        <button
          onClick={handleSubmit}
          disabled={!newComment.trim()}
          className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-glow transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
