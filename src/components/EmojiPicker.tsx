import { useState, useRef, useEffect } from 'react';
import { Smile } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const EMOJI_CATEGORIES = [
  {
    name: 'Sık Kullanılan',
    emojis: ['⚽', '🔥', '💪', '👏', '🎯', '⭐', '🏆', '🥅', '🧤', '🦶']
  },
  {
    name: 'Spor',
    emojis: ['⚽', '🏃', '🥇', '🥈', '🥉', '🏅', '🎖️', '🏟️', '🥅', '🧤', '👟', '🦵', '🦶', '💨', '🔥']
  },
  {
    name: 'İfadeler',
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '😊', '😎', '🤩', '😤', '💪', '👊']
  },
  {
    name: 'El Hareketleri',
    emojis: ['👍', '👎', '👏', '🙌', '🤝', '✋', '🤚', '🖐️', '✌️', '🤞', '🤟', '🤙', '👋', '💪', '🙏']
  },
  {
    name: 'Semboller',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '💯', '✅', '❌', '⭐', '🌟', '💥', '💫', '🎉']
  }
];

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={pickerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-10 h-10 rounded-xl bg-surface flex items-center justify-center hover:bg-surface-hover hover:text-primary transition-all",
          isOpen && "bg-surface-hover text-primary"
        )}
      >
        <Smile className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute bottom-12 left-0 w-72 bg-card border border-border rounded-xl shadow-lg z-50 animate-scale-in overflow-hidden">
          {/* Category Tabs */}
          <div className="flex border-b border-border overflow-x-auto scrollbar-hide">
            {EMOJI_CATEGORIES.map((cat, index) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(index)}
                className={cn(
                  "px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors",
                  activeCategory === index
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Emoji Grid */}
          <div className="p-3 max-h-48 overflow-y-auto">
            <div className="grid grid-cols-8 gap-1">
              {EMOJI_CATEGORIES[activeCategory].emojis.map((emoji, index) => (
                <button
                  key={`${emoji}-${index}`}
                  onClick={() => handleEmojiClick(emoji)}
                  className="w-8 h-8 flex items-center justify-center text-lg hover:bg-surface rounded-lg transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
