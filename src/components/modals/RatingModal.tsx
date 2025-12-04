import { useState } from 'react';
import { X, Star, Trophy } from 'lucide-react';
import { POSITIONS, Position, PositionAttribute } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface RatingSliderProps {
  value: number;
  onChange: (value: number) => void;
  attribute: PositionAttribute;
}

function RatingSlider({ value, onChange, attribute }: RatingSliderProps) {
  const getColorByValue = (val: number) => {
    if (val >= 8) return 'text-primary';
    if (val >= 6) return 'text-success';
    if (val >= 4) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{attribute.label}</span>
        <span className={cn("text-lg font-bold", getColorByValue(value))}>
          {value.toFixed(1)}
        </span>
      </div>
      <input
        type="range"
        min="1"
        max="10"
        step="0.5"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="rating-slider"
      />
    </div>
  );
}

interface RatingModalProps {
  onClose: () => void;
  onSubmit: (ratings: Record<string, number>, position: Position) => void;
  playerName?: string;
  playerPosition?: Position;
}

export function RatingModal({ onClose, onSubmit, playerName = "Oyuncu", playerPosition = 'midfielder' }: RatingModalProps) {
  const [selectedPosition, setSelectedPosition] = useState<Position>(playerPosition);
  const [ratings, setRatings] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    POSITIONS[playerPosition].attributes.forEach(attr => {
      initial[attr.id] = 5;
    });
    return initial;
  });

  const positionConfig = POSITIONS[selectedPosition];
  const averageRating = Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).length;

  const handlePositionChange = (position: Position) => {
    setSelectedPosition(position);
    const newRatings: Record<string, number> = {};
    POSITIONS[position].attributes.forEach(attr => {
      newRatings[attr.id] = ratings[attr.id] || 5;
    });
    setRatings(newRatings);
  };

  const handleRatingChange = (attributeId: string, value: number) => {
    setRatings(prev => ({ ...prev, [attributeId]: value }));
  };

  const handleSubmit = () => {
    onSubmit(ratings, selectedPosition);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card w-full max-w-md rounded-2xl border border-border shadow-card overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-border bg-gradient-to-r from-surface to-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Maç Değerlendirmesi</h2>
                <p className="text-sm text-muted-foreground">{playerName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-surface hover:bg-surface-hover flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Position Selector */}
        <div className="p-4 border-b border-border">
          <p className="text-sm text-muted-foreground mb-3">Mevki Seçin</p>
          <div className="flex gap-2">
            {(Object.keys(POSITIONS) as Position[]).map((pos) => (
              <button
                key={pos}
                onClick={() => handlePositionChange(pos)}
                className={cn(
                  "flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all",
                  selectedPosition === pos
                    ? `${POSITIONS[pos].className} shadow-glow`
                    : "bg-surface text-muted-foreground hover:bg-surface-hover"
                )}
              >
                {POSITIONS[pos].labelTr}
              </button>
            ))}
          </div>
        </div>

        {/* Rating Sliders */}
        <div className="p-6 space-y-6 max-h-[300px] overflow-y-auto scrollbar-thin">
          {positionConfig.attributes.map((attr) => (
            <RatingSlider
              key={attr.id}
              attribute={attr}
              value={ratings[attr.id] || 5}
              onChange={(val) => handleRatingChange(attr.id, val)}
            />
          ))}
        </div>

        {/* Average Score */}
        <div className="p-4 border-t border-border bg-surface/50">
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium">Ortalama Puan</span>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-gold" />
              <span className="text-2xl font-bold gradient-text">{averageRating.toFixed(1)}</span>
            </div>
          </div>
          <Button onClick={handleSubmit} className="w-full h-12 text-base font-semibold">
            Değerlendirmeyi Gönder
          </Button>
        </div>
      </div>
    </div>
  );
}
