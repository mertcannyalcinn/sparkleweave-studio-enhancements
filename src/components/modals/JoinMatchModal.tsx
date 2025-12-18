import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { MapPin, Clock, User, MessageSquare, ChevronRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Post, POSITIONS, Position } from '@/lib/data';

interface JoinMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
  onSubmit: (data: JoinMatchData) => void;
}

export interface JoinMatchData {
  position: Position;
  experience: string;
  message: string;
  postId: string;
}

const EXPERIENCE_OPTIONS = [
  { id: 'beginner', label: 'Yeni Başlayan', desc: '0-1 yıl tecrübe' },
  { id: 'intermediate', label: 'Orta Seviye', desc: '1-3 yıl tecrübe' },
  { id: 'advanced', label: 'İleri Seviye', desc: '3-5 yıl tecrübe' },
  { id: 'pro', label: 'Profesyonel', desc: '5+ yıl tecrübe' },
];

export function JoinMatchModal({ isOpen, onClose, post, onSubmit }: JoinMatchModalProps) {
  const [step, setStep] = useState(1);
  const [position, setPosition] = useState<Position>('midfielder');
  const [experience, setExperience] = useState('intermediate');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!post) return;
    onSubmit({
      position,
      experience,
      message,
      postId: post.id,
    });
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setStep(1);
      setMessage('');
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    setStep(1);
    setMessage('');
    setIsSubmitted(false);
    onClose();
  };

  if (!post) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg bg-card border-border">
        {isSubmitted ? (
          <div className="py-12 text-center animate-scale-in">
            <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>
            <h3 className="text-xl font-bold">Başvurun Gönderildi!</h3>
            <p className="text-muted-foreground mt-2">
              {post.user} en kısa sürede seninle iletişime geçecek.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Maça Katıl</DialogTitle>
            </DialogHeader>

            {/* Post Summary */}
            <div className="p-4 bg-surface rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-3">
                <img src={post.avatar} alt={post.user} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-semibold">{post.user}</p>
                  <p className="text-xs text-muted-foreground">{post.time}</p>
                </div>
              </div>
              <p className="font-medium text-sm">{post.title}</p>
              <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted-foreground">
                {post.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {post.location}
                  </span>
                )}
                {post.timeSpec && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.timeSpec}
                  </span>
                )}
                {post.price && (
                  <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">
                    {post.price}
                  </span>
                )}
              </div>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    step >= s ? "bg-primary w-6" : "bg-muted"
                  )}
                />
              ))}
            </div>

            {/* Step 1: Position */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Hangi pozisyonda oynuyorsun?</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {(Object.keys(POSITIONS) as Position[]).map((pos) => (
                    <button
                      key={pos}
                      onClick={() => setPosition(pos)}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all text-left",
                        position === pos
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className={cn("text-sm font-bold", POSITIONS[pos].className)}>
                        {POSITIONS[pos].labelTr}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {POSITIONS[pos].attributes.slice(0, 2).map(a => a.label).join(', ')}
                      </div>
                    </button>
                  ))}
                </div>
                <Button onClick={() => setStep(2)} className="w-full gap-2">
                  Devam Et <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Step 2: Experience */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Tecrübe seviyen nedir?</span>
                </div>
                <RadioGroup value={experience} onValueChange={setExperience} className="space-y-3">
                  {EXPERIENCE_OPTIONS.map((opt) => (
                    <div
                      key={opt.id}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                        experience === opt.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                      onClick={() => setExperience(opt.id)}
                    >
                      <RadioGroupItem value={opt.id} id={opt.id} />
                      <Label htmlFor={opt.id} className="flex-1 cursor-pointer">
                        <div className="font-semibold">{opt.label}</div>
                        <div className="text-xs text-muted-foreground">{opt.desc}</div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Geri
                  </Button>
                  <Button onClick={() => setStep(3)} className="flex-1 gap-2">
                    Devam Et <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Message */}
            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm font-medium">Eklemek istediğin bir şey var mı? (Opsiyonel)</span>
                </div>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Kendini tanıt, neden bu maça katılmak istediğini belirt..."
                  className="min-h-[100px] bg-surface border-border resize-none"
                />
                <div className="p-4 bg-surface rounded-xl border border-border">
                  <p className="text-sm font-medium mb-2">Başvuru Özeti</p>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>📍 Pozisyon: <span className="text-foreground">{POSITIONS[position].labelTr}</span></p>
                    <p>⚽ Tecrübe: <span className="text-foreground">{EXPERIENCE_OPTIONS.find(e => e.id === experience)?.label}</span></p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                    Geri
                  </Button>
                  <Button onClick={handleSubmit} className="flex-1 gap-2">
                    Başvur <CheckCircle2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
