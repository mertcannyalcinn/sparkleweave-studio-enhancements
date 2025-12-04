import { X, MapPin, Clock, Users, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface CreateMatchModalProps {
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    location: string;
    date: string;
    time: string;
    price: string;
    urgency: string;
  }) => void;
}

export function CreateMatchModal({ onClose, onSubmit }: CreateMatchModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    price: '',
    urgency: 'Normal',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.location && formData.date && formData.time) {
      onSubmit(formData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card w-full max-w-lg rounded-2xl border border-border shadow-card overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-border bg-gradient-to-r from-surface to-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Yeni Maç Oluştur</h2>
                <p className="text-sm text-muted-foreground">Oyuncu bul, maç kur</p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Başlık *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="örn: Bu akşam 2 oyuncu arıyoruz"
              className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Açıklama</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Maç hakkında detaylar..."
              rows={3}
              className="w-full px-4 py-3 bg-surface border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Konum *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="örn: Kadıköy, Yoğurtçu Parkı"
              className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              required
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Tarih *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Saat *</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                required
              />
            </div>
          </div>

          {/* Price & Urgency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Ücret</label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="örn: 50₺/kişi"
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                Aciliyet
              </label>
              <select
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              >
                <option value="Normal">Normal</option>
                <option value="Acil">Acil</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full h-12 text-base font-semibold mt-4">
            Maç Oluştur
          </Button>
        </form>
      </div>
    </div>
  );
}
