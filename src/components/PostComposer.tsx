import { useState, useRef } from 'react';
import { Image, Send, X, Smile } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface PostComposerProps {
  newPostText: string;
  setNewPostText: (text: string) => void;
  onSharePost: (imageUrl?: string) => void;
  userAvatar: string;
}

export function PostComposer({
  newPostText,
  setNewPostText,
  onSharePost,
  userAvatar,
}: PostComposerProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShare = () => {
    if (newPostText.trim()) {
      onSharePost(imagePreview || undefined);
      setImagePreview(null);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn(
      "mx-6 mt-6 p-4 bg-card rounded-2xl border transition-all duration-300",
      isFocused ? "border-primary shadow-glow" : "border-border"
    )}>
      <div className="flex gap-4">
        <img
          src={userAvatar}
          alt="Avatar"
          className="w-12 h-12 rounded-full object-cover ring-2 ring-border"
        />
        <div className="flex-1">
          <textarea
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Ne düşünüyorsun? Bir şeyler paylaş..."
            className="w-full bg-transparent resize-none outline-none text-foreground placeholder:text-muted-foreground min-h-[60px] text-base"
            rows={2}
          />

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative mt-3 rounded-xl overflow-hidden animate-scale-in">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full max-h-64 object-cover rounded-xl"
              />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-destructive transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center cursor-pointer hover:bg-surface-hover hover:text-primary transition-all"
              >
                <Image className="w-5 h-5" />
              </label>
              <button className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center hover:bg-surface-hover hover:text-primary transition-all">
                <Smile className="w-5 h-5" />
              </button>
            </div>

            <Button
              onClick={handleShare}
              disabled={!newPostText.trim()}
              className="gap-2 px-5 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              Paylaş
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
