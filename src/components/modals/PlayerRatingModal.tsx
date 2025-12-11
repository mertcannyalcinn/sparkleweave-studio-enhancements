import { useState } from 'react';
import { X, Star, Trophy, Users, ChevronRight, ArrowLeft, Heart, MessageCircle, Shield, Handshake } from 'lucide-react';
import { BOT_USERS, POSITIONS, Position, PositionAttribute, User } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface RatingSliderProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
}

function RatingSlider({ value, onChange, label }: RatingSliderProps) {
  const getColorByValue = (val: number) => {
    if (val >= 8) return 'text-primary';
    if (val >= 6) return 'text-success';
    if (val >= 4) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
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

interface PlayerRatingModalProps {
  onClose: () => void;
  onSubmit: (data: {
    playerId: string;
    position: Position;
    skillRatings: Record<string, number>;
    sportsmanshipRatings: Record<string, number>;
    comment?: string;
  }) => void;
}

type Step = 'select_player' | 'rate_skills' | 'rate_sportsmanship';

export function PlayerRatingModal({ onClose, onSubmit }: PlayerRatingModalProps) {
  const [step, setStep] = useState<Step>('select_player');
  const [selectedPlayer, setSelectedPlayer] = useState<User | null>(null);
  const [skillRatings, setSkillRatings] = useState<Record<string, number>>({});
  const [sportsmanshipRatings, setSportsmanshipRatings] = useState({
    sportsmanship: 5,
    reliability: 5,
    teamwork: 5,
    communication: 5,
  });
  const [comment, setComment] = useState('');

  // Simulated match participants (bot users)
  const matchParticipants = BOT_USERS;

  const handlePlayerSelect = (player: User) => {
    setSelectedPlayer(player);
    // Initialize skill ratings based on player's position
    const initialRatings: Record<string, number> = {};
    POSITIONS[player.position].attributes.forEach(attr => {
      initialRatings[attr.id] = 5;
    });
    setSkillRatings(initialRatings);
    setStep('rate_skills');
  };

  const handleSkillRatingChange = (attrId: string, value: number) => {
    setSkillRatings(prev => ({ ...prev, [attrId]: value }));
  };

  const handleSportsmanshipChange = (key: string, value: number) => {
    setSportsmanshipRatings(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!selectedPlayer) return;
    
    onSubmit({
      playerId: selectedPlayer.id,
      position: selectedPlayer.position,
      skillRatings,
      sportsmanshipRatings,
      comment: comment.trim() || undefined,
    });
    toast.success(`${selectedPlayer.name} için değerlendirme gönderildi!`);
    onClose();
  };

  const positionConfig = selectedPlayer ? POSITIONS[selectedPlayer.position] : null;
  
  const skillAverage = Object.values(skillRatings).length > 0
    ? Object.values(skillRatings).reduce((a, b) => a + b, 0) / Object.values(skillRatings).length
    : 0;
  
  const sportsmanshipAverage = Object.values(sportsmanshipRatings).reduce((a, b) => a + b, 0) / 4;
  const totalAverage = (skillAverage + sportsmanshipAverage) / 2;

  const sportsmanshipLabels = {
    sportsmanship: { label: 'Sportmenlik', icon: Heart },
    reliability: { label: 'Güvenilirlik', icon: Shield },
    teamwork: { label: 'Takım Oyunu', icon: Users },
    communication: { label: 'İletişim', icon: MessageCircle },
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card w-full max-w-md rounded-2xl border border-border shadow-card overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-border bg-gradient-to-r from-surface to-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {step !== 'select_player' && (
                <button
                  onClick={() => setStep(step === 'rate_sportsmanship' ? 'rate_skills' : 'select_player')}
                  className="w-10 h-10 rounded-xl bg-surface hover:bg-surface-hover flex items-center justify-center transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                {step === 'select_player' ? (
                  <Users className="w-6 h-6 text-primary" />
                ) : step === 'rate_skills' ? (
                  <Star className="w-6 h-6 text-primary" />
                ) : (
                  <Handshake className="w-6 h-6 text-primary" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {step === 'select_player' && 'Oyuncu Seç'}
                  {step === 'rate_skills' && 'Beceri Puanla'}
                  {step === 'rate_sportsmanship' && 'Sportmenlik'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {step === 'select_player' && 'Değerlendirmek istediğin oyuncuyu seç'}
                  {step === 'rate_skills' && selectedPlayer?.name}
                  {step === 'rate_sportsmanship' && selectedPlayer?.name}
                </p>
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

        {/* Step 1: Select Player */}
        {step === 'select_player' && (
          <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
            {matchParticipants.map((player, index) => (
              <button
                key={player.id}
                onClick={() => handlePlayerSelect(player)}
                className="w-full p-4 flex items-center gap-4 border-b border-border/50 last:border-0 hover:bg-surface transition-all animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <img
                  src={player.avatar}
                  alt={player.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-border"
                />
                <div className="flex-1 text-left">
                  <p className="font-semibold">{player.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", POSITIONS[player.position].className)}>
                      {POSITIONS[player.position].labelTr}
                    </span>
                    <span className="text-xs text-muted-foreground">{player.handle}</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Rate Skills */}
        {step === 'rate_skills' && selectedPlayer && positionConfig && (
          <>
            {/* Player Info */}
            <div className="p-4 border-b border-border flex items-center gap-3">
              <img
                src={selectedPlayer.avatar}
                alt={selectedPlayer.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-border"
              />
              <div className="flex-1">
                <p className="font-semibold">{selectedPlayer.name}</p>
                <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium inline-block mt-1", positionConfig.className)}>
                  {positionConfig.labelTr}
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Ortalama</p>
                <p className="text-xl font-bold gradient-text">{skillAverage.toFixed(1)}</p>
              </div>
            </div>

            {/* Skill Sliders */}
            <div className="p-6 space-y-6 max-h-[250px] overflow-y-auto scrollbar-thin">
              {positionConfig.attributes.map((attr) => (
                <RatingSlider
                  key={attr.id}
                  label={attr.label}
                  value={skillRatings[attr.id] || 5}
                  onChange={(val) => handleSkillRatingChange(attr.id, val)}
                />
              ))}
            </div>

            {/* Next Button */}
            <div className="p-4 border-t border-border bg-surface/50">
              <Button onClick={() => setStep('rate_sportsmanship')} className="w-full h-12 text-base font-semibold">
                Devam Et
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </>
        )}

        {/* Step 3: Rate Sportsmanship */}
        {step === 'rate_sportsmanship' && selectedPlayer && (
          <>
            {/* Player Info */}
            <div className="p-4 border-b border-border flex items-center gap-3">
              <img
                src={selectedPlayer.avatar}
                alt={selectedPlayer.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-border"
              />
              <div className="flex-1">
                <p className="font-semibold">{selectedPlayer.name}</p>
                <p className="text-xs text-muted-foreground">Sportmenlik & Güvenilirlik</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Toplam</p>
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-gold" />
                  <p className="text-xl font-bold gradient-text">{totalAverage.toFixed(1)}</p>
                </div>
              </div>
            </div>

            {/* Sportsmanship Sliders */}
            <div className="p-6 space-y-6 max-h-[200px] overflow-y-auto scrollbar-thin">
              {Object.entries(sportsmanshipLabels).map(([key, { label, icon: Icon }]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <RatingSlider
                      label={label}
                      value={sportsmanshipRatings[key as keyof typeof sportsmanshipRatings]}
                      onChange={(val) => handleSportsmanshipChange(key, val)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Comment */}
            <div className="px-6 pb-4">
              <label className="block text-sm font-medium mb-2">Yorum (Opsiyonel)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Bu oyuncu hakkında bir şeyler yaz..."
                rows={2}
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
              />
            </div>

            {/* Submit Button */}
            <div className="p-4 border-t border-border bg-surface/50">
              <Button onClick={handleSubmit} className="w-full h-12 text-base font-semibold">
                <Trophy className="w-5 h-5 mr-2" />
                Değerlendirmeyi Gönder
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
