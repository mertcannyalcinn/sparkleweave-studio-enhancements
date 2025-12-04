import { BookOpen, Video, FileText, Users, Play, Clock, Star, ChevronRight, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

const academyCategories = [
  { id: 'basics', label: 'Temel Teknikler', icon: '⚽', count: 24 },
  { id: 'tactics', label: 'Taktik & Strateji', icon: '📋', count: 18 },
  { id: 'fitness', label: 'Fiziksel Kondisyon', icon: '💪', count: 12 },
  { id: 'mental', label: 'Mental Güç', icon: '🧠', count: 8 },
];

const featuredLessons = [
  {
    id: 1,
    title: 'Mükemmel Pas Teknikleri',
    instructor: 'Ahmet Yılmaz',
    duration: '15 dk',
    thumbnail: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&q=80&w=400',
    rating: 4.9,
    students: 1234,
  },
  {
    id: 2,
    title: '4-3-3 Diziliş Rehberi',
    instructor: 'Mehmet Kaya',
    duration: '22 dk',
    thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=400',
    rating: 4.8,
    students: 892,
  },
  {
    id: 3,
    title: 'Kaleci Refleks Antrenmanı',
    instructor: 'Can Demir',
    duration: '18 dk',
    thumbnail: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=400',
    rating: 4.7,
    students: 567,
  },
];

export function AcademyView() {
  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Qors Akademi</h1>
            <p className="text-muted-foreground">Futbol becerilerini geliştir</p>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="max-w-4xl mx-auto mt-6">
        <div className="relative p-8 rounded-2xl overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
          <div className="relative z-10">
            <span className="px-3 py-1 bg-primary/20 text-primary text-sm font-medium rounded-full">Yeni</span>
            <h2 className="text-2xl font-bold mt-3">Profesyonel Futbolculardan Öğren</h2>
            <p className="text-muted-foreground mt-2 max-w-md">
              Amatör ligden profesyonel seviyeye çıkmak için gereken tüm bilgiler burada.
            </p>
            <button className="mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center gap-2 hover:shadow-glow transition-all">
              <Play className="w-5 h-5" />
              Başla
            </button>
          </div>
          <div className="absolute right-0 top-0 w-1/3 h-full opacity-20">
            <Trophy className="w-full h-full" />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-4xl mx-auto mt-8">
        <h2 className="font-semibold mb-4">Kategoriler</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {academyCategories.map((cat, index) => (
            <button
              key={cat.id}
              className={cn(
                "p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-all text-left group animate-fade-in-up",
                `stagger-${index + 1}`
              )}
            >
              <span className="text-3xl">{cat.icon}</span>
              <h3 className="font-semibold mt-2 group-hover:text-primary transition-colors">{cat.label}</h3>
              <p className="text-sm text-muted-foreground">{cat.count} ders</p>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Lessons */}
      <div className="max-w-4xl mx-auto mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Öne Çıkan Dersler</h2>
          <button className="text-sm text-primary flex items-center gap-1 hover:underline">
            Tümünü Gör <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredLessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className={cn(
                "bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-all cursor-pointer group animate-fade-in-up",
                `stagger-${index + 1}`
              )}
            >
              <div className="relative">
                <img
                  src={lesson.thumbnail}
                  alt={lesson.title}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-glow">
                    <Play className="w-6 h-6 text-primary-foreground ml-1" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 px-2 py-1 bg-background/80 backdrop-blur-sm rounded-md text-xs font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {lesson.duration}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold group-hover:text-primary transition-colors">{lesson.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{lesson.instructor}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-gold fill-current" />
                    <span className="text-sm font-medium">{lesson.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{lesson.students}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
