// Types
export type Position = 'goalkeeper' | 'defender' | 'midfielder' | 'forward';

export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  cover: string;
  qorsScore: number;
  fairPlayBadge: boolean;
  matchesPlayed: number;
  reliability: string;
  role: string;
  bio: string;
  position: Position;
  stats: {
    mvp: number;
    goals: number;
    assists: number;
  };
  isBot?: boolean;
  followers?: number;
  following?: number;
}

export interface Comment {
  id: string;
  user: string;
  userId: string;
  avatar: string;
  text: string;
  time: string;
}

export interface Post {
  id: string;
  type: 'video' | 'lineup' | 'transfer' | 'status';
  category: string;
  user: string;
  userId: string;
  avatar: string;
  title: string;
  description?: string;
  thumbnail?: string;
  formation?: string;
  views?: number;
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
  time: string;
  tags?: string[];
  qorsScore: number;
  badge?: string;
  comments: Comment[];
  subType?: string;
  location?: string;
  timeSpec?: string;
  price?: string;
  urgency?: string;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'system' | 'match_rating' | 'match_star';
  title: string;
  message?: string;
  user?: string;
  avatar?: string;
  time: string;
  isRead: boolean;
}

export interface PositionAttribute {
  id: string;
  label: string;
}

export interface PositionConfig {
  label: string;
  labelTr: string;
  color: string;
  className: string;
  attributes: PositionAttribute[];
}

// Position configurations
export const POSITIONS: Record<Position, PositionConfig> = {
  goalkeeper: {
    label: 'Goalkeeper',
    labelTr: 'Kaleci',
    color: 'hsl(var(--goalkeeper))',
    className: 'position-goalkeeper',
    attributes: [
      { id: 'reflexes', label: 'Refleksler' },
      { id: 'positioning', label: 'Pozisyon Alma' },
      { id: 'command', label: 'Alan Hakimiyeti' },
      { id: 'distribution', label: 'Pas Dağıtımı' },
    ]
  },
  defender: {
    label: 'Defender',
    labelTr: 'Defans',
    color: 'hsl(var(--defender))',
    className: 'position-defender',
    attributes: [
      { id: 'tackling', label: 'Müdahale' },
      { id: 'marking', label: 'Adam Markajı' },
      { id: 'aerial', label: 'Hava Topu' },
      { id: 'buildup', label: 'Oyun Kurma' },
    ]
  },
  midfielder: {
    label: 'Midfielder',
    labelTr: 'Orta Saha',
    color: 'hsl(var(--midfielder))',
    className: 'position-midfielder',
    attributes: [
      { id: 'passing', label: 'Pas' },
      { id: 'vision', label: 'Oyun Görüşü' },
      { id: 'stamina', label: 'Dayanıklılık' },
      { id: 'control', label: 'Top Kontrolü' },
    ]
  },
  forward: {
    label: 'Forward',
    labelTr: 'Forvet',
    color: 'hsl(var(--forward))',
    className: 'position-forward',
    attributes: [
      { id: 'finishing', label: 'Bitiricilik' },
      { id: 'positioning', label: 'Pozisyon Alma' },
      { id: 'speed', label: 'Hız' },
      { id: 'dribbling', label: 'Çalım' },
    ]
  },
};

// Categories
export const CATEGORIES = [
  { id: 'all', label: 'Tümü', icon: 'Grid3x3' },
  { id: 'tactics', label: 'Taktik', icon: 'Target' },
  { id: 'highlights', label: 'Goller', icon: 'Zap' },
  { id: 'defense', label: 'Akademi', icon: 'Shield' },
  { id: 'lmg', label: 'LMG', icon: 'AlertCircle' },
];

// Default user
export const DEFAULT_USER: User = {
  id: "default",
  name: "Yeni Kullanıcı",
  handle: "@kullanici",
  avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200",
  cover: "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?auto=format&fit=crop&q=80&w=1200",
  qorsScore: 5.0,
  fairPlayBadge: false,
  matchesPlayed: 0,
  reliability: "Yeni",
  role: "Oyuncu",
  bio: "Futbol tutkunu",
  position: 'midfielder',
  stats: { mvp: 0, goals: 0, assists: 0 },
  followers: 0,
  following: 0,
};

// Bot users
export const BOT_USERS: User[] = [
  {
    id: "bot-1",
    name: "Ahmet Yılmaz",
    handle: "@ahmet_yilmaz",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    cover: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&q=80&w=1200",
    qorsScore: 9.2,
    fairPlayBadge: true,
    matchesPlayed: 156,
    reliability: "Elit",
    role: "Kaptan",
    bio: "10 yıllık halı saha tecrübesi. Her pozisyonda oynarım ama kaleci olmak ayrı bir tutku. 🧤",
    position: 'goalkeeper',
    stats: { mvp: 23, goals: 5, assists: 12 },
    isBot: true,
    followers: 1240,
    following: 89,
  },
  {
    id: "bot-2",
    name: "Mehmet Kaya",
    handle: "@mehmet_k",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    cover: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200",
    qorsScore: 8.8,
    fairPlayBadge: true,
    matchesPlayed: 98,
    reliability: "Güvenilir",
    role: "Oyuncu",
    bio: "Defansın kalesi 🛡️ Topla çıkmayı seven, klas stoper. Hafta içi Kadıköy, hafta sonu her yerdeyim.",
    position: 'defender',
    stats: { mvp: 15, goals: 8, assists: 22 },
    isBot: true,
    followers: 856,
    following: 234,
  },
  {
    id: "bot-3",
    name: "Can Demir",
    handle: "@candemir10",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
    cover: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=1200",
    qorsScore: 9.5,
    fairPlayBadge: true,
    matchesPlayed: 234,
    reliability: "Efsane",
    role: "Organizatör",
    bio: "Orta sahanın patronu 👑 Asist kralı, oyun kurucusu. Takımı ben toplarım, maçı ben organize ederim.",
    position: 'midfielder',
    stats: { mvp: 45, goals: 67, assists: 134 },
    isBot: true,
    followers: 2340,
    following: 156,
  },
  {
    id: "bot-4",
    name: "Emre Şahin",
    handle: "@emre_sahin9",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
    cover: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1200",
    qorsScore: 9.0,
    fairPlayBadge: false,
    matchesPlayed: 178,
    reliability: "Pro",
    role: "Golcü",
    bio: "Gol makinesi ⚽️ Her pozisyondan vururum. Takımınıza golcü lazımsa buradayım!",
    position: 'forward',
    stats: { mvp: 38, goals: 156, assists: 45 },
    isBot: true,
    followers: 1890,
    following: 312,
  },
  {
    id: "bot-5",
    name: "Burak Özkan",
    handle: "@burak_ozkan",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200",
    cover: "https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&q=80&w=1200",
    qorsScore: 7.8,
    fairPlayBadge: true,
    matchesPlayed: 67,
    reliability: "Güvenilir",
    role: "Oyuncu",
    bio: "Hızlı kanat oyuncusu 💨 Genç ve enerjik. Her maça açığım!",
    position: 'forward',
    stats: { mvp: 8, goals: 34, assists: 28 },
    isBot: true,
    followers: 534,
    following: 421,
  },
  {
    id: "bot-6",
    name: "Serkan Yıldız",
    handle: "@serkan_y",
    avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&q=80&w=200",
    cover: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=1200",
    qorsScore: 8.5,
    fairPlayBadge: true,
    matchesPlayed: 112,
    reliability: "Pro",
    role: "Oyuncu",
    bio: "Orta saha motoru 🔥 Koşuyu seven, top kapan, her yerde olan oyuncu.",
    position: 'midfielder',
    stats: { mvp: 19, goals: 23, assists: 56 },
    isBot: true,
    followers: 723,
    following: 198,
  },
];

// Sample posts from bots
export const SAMPLE_POSTS: Post[] = [
  {
    id: "post-1",
    type: 'status',
    category: 'all',
    user: BOT_USERS[2].name,
    userId: BOT_USERS[2].id,
    avatar: BOT_USERS[2].avatar,
    title: "Dünkü maçta harika bir gol attım! Kale direğinden dönen top ve ardından vole 🎯 Takım olarak muhteşem bir performans sergiledik.",
    thumbnail: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800",
    views: 1250,
    likes: 89,
    isLiked: false,
    isSaved: false,
    time: "2 saat önce",
    qorsScore: BOT_USERS[2].qorsScore,
    comments: [
      {
        id: "c1",
        user: BOT_USERS[3].name,
        userId: BOT_USERS[3].id,
        avatar: BOT_USERS[3].avatar,
        text: "O vole efsaneydi! 👏",
        time: "1 saat önce"
      }
    ],
  },
  {
    id: "post-2",
    type: 'transfer',
    category: 'lmg',
    user: BOT_USERS[0].name,
    userId: BOT_USERS[0].id,
    avatar: BOT_USERS[0].avatar,
    title: "🚨 ACİL! Bu akşam 20:00 maçımıza 2 oyuncu lazım!",
    description: "Kadıköy Yoğurtçu Parkı halı sahada maçımız var. Seviyeli oyun, kavgasız gürültüsüz. Kalecimiz ve 1 orta saha arıyoruz.",
    location: "Kadıköy, Yoğurtçu Parkı",
    timeSpec: "Bu akşam 20:00",
    price: "50₺/kişi",
    urgency: "Acil",
    subType: "oyuncu",
    views: 456,
    likes: 23,
    isLiked: false,
    isSaved: false,
    time: "30 dakika önce",
    qorsScore: BOT_USERS[0].qorsScore,
    comments: [
      {
        id: "c2",
        user: BOT_USERS[5].name,
        userId: BOT_USERS[5].id,
        avatar: BOT_USERS[5].avatar,
        text: "Orta saha için ben varım! Mesaj attım.",
        time: "15 dakika önce"
      }
    ],
  },
  {
    id: "post-3",
    type: 'video',
    category: 'highlights',
    user: BOT_USERS[3].name,
    userId: BOT_USERS[3].id,
    avatar: BOT_USERS[3].avatar,
    title: "Hat-trick! Geçen haftanın özetini izleyin 🔥",
    description: "3 gol, 1 asist. En iyi performanslarımdan biri.",
    thumbnail: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&q=80&w=800",
    views: 3420,
    likes: 234,
    isLiked: false,
    isSaved: false,
    time: "5 saat önce",
    qorsScore: BOT_USERS[3].qorsScore,
    badge: "🏆 Haftanın Oyuncusu",
    comments: [],
  },
  {
    id: "post-4",
    type: 'lineup',
    category: 'tactics',
    user: BOT_USERS[1].name,
    userId: BOT_USERS[1].id,
    avatar: BOT_USERS[1].avatar,
    title: "4-3-3 diziliş önerim - Hücum odaklı",
    description: "Bu dizilişle son 5 maçta 4 galibiyet aldık. Kanat oyuncularının içe kesmesi çok önemli.",
    formation: "4-3-3",
    views: 892,
    likes: 67,
    isLiked: false,
    isSaved: false,
    time: "1 gün önce",
    qorsScore: BOT_USERS[1].qorsScore,
    tags: ["Taktik", "4-3-3", "Hücum"],
    comments: [
      {
        id: "c3",
        user: BOT_USERS[2].name,
        userId: BOT_USERS[2].id,
        avatar: BOT_USERS[2].avatar,
        text: "Bu dizilişte 10 numara nerede oynuyor?",
        time: "20 saat önce"
      },
      {
        id: "c4",
        user: BOT_USERS[1].name,
        userId: BOT_USERS[1].id,
        avatar: BOT_USERS[1].avatar,
        text: "Merkez orta sahanın biraz önünde, sahte 9 gibi düşün.",
        time: "19 saat önce"
      }
    ],
  },
  {
    id: "post-5",
    type: 'status',
    category: 'defense',
    user: BOT_USERS[4].name,
    userId: BOT_USERS[4].id,
    avatar: BOT_USERS[4].avatar,
    title: "Qors Akademi'deki antrenman videoları sayesinde top kontrolüm çok gelişti! Herkese tavsiye ederim 📚",
    views: 567,
    likes: 45,
    isLiked: false,
    isSaved: false,
    time: "3 saat önce",
    qorsScore: BOT_USERS[4].qorsScore,
    comments: [],
  },
  {
    id: "post-6",
    type: 'transfer',
    category: 'lmg',
    user: BOT_USERS[5].name,
    userId: BOT_USERS[5].id,
    avatar: BOT_USERS[5].avatar,
    title: "Yarın akşam maç var - 1 kaleci arıyoruz",
    description: "Beşiktaş Barbaros halı saha. 7v7 maç, 2 devre 30'ar dakika. Seviyemiz orta-üst.",
    location: "Beşiktaş, Barbaros Bulvarı",
    timeSpec: "Yarın 19:30",
    price: "60₺/kişi",
    subType: "kaleci",
    views: 234,
    likes: 12,
    isLiked: false,
    isSaved: false,
    time: "6 saat önce",
    qorsScore: BOT_USERS[5].qorsScore,
    comments: [
      {
        id: "c5",
        user: BOT_USERS[0].name,
        userId: BOT_USERS[0].id,
        avatar: BOT_USERS[0].avatar,
        text: "Kaleci olarak ben katılabilirim! DM attım.",
        time: "5 saat önce"
      }
    ],
  },
  {
    id: "post-7",
    type: 'video',
    category: 'highlights',
    user: BOT_USERS[0].name,
    userId: BOT_USERS[0].id,
    avatar: BOT_USERS[0].avatar,
    title: "Penaltı kurtarışı! Son dakikada maçı kurtardık 🧤",
    thumbnail: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=800",
    views: 2100,
    likes: 178,
    isLiked: false,
    isSaved: false,
    time: "1 gün önce",
    qorsScore: BOT_USERS[0].qorsScore,
    comments: [],
  },
  {
    id: "post-8",
    type: 'status',
    category: 'all',
    user: BOT_USERS[2].name,
    userId: BOT_USERS[2].id,
    avatar: BOT_USERS[2].avatar,
    title: "Bu hafta 3 maç organize ettim, hepsinde galibiyet! Takım ruhu her şeyden önemli 💪",
    views: 890,
    likes: 112,
    isLiked: false,
    isSaved: false,
    time: "8 saat önce",
    qorsScore: BOT_USERS[2].qorsScore,
    comments: [],
  },
  {
    id: "post-9",
    type: 'transfer',
    category: 'lmg',
    user: BOT_USERS[3].name,
    userId: BOT_USERS[3].id,
    avatar: BOT_USERS[3].avatar,
    title: "🔴 ACİL! 1 saat sonra maç var, 3 kişi eksik!",
    description: "Ataşehir Carrefour yanı halı saha. 6v6 maç yapıyoruz. 2 kanat, 1 stoper lazım. Seviye orta-üst.",
    location: "Ataşehir, Carrefour Yanı",
    timeSpec: "Bugün 21:30",
    price: "45₺/kişi",
    urgency: "Acil",
    subType: "oyuncu",
    views: 789,
    likes: 34,
    isLiked: false,
    isSaved: false,
    time: "45 dakika önce",
    qorsScore: BOT_USERS[3].qorsScore,
    comments: [
      {
        id: "c6",
        user: BOT_USERS[4].name,
        userId: BOT_USERS[4].id,
        avatar: BOT_USERS[4].avatar,
        text: "Kanat için gelebilirim, DM?",
        time: "30 dakika önce"
      }
    ],
  },
  {
    id: "post-10",
    type: 'video',
    category: 'highlights',
    user: BOT_USERS[4].name,
    userId: BOT_USERS[4].id,
    avatar: BOT_USERS[4].avatar,
    title: "Bu gol nasıl oldu anlamadım! 😱⚽",
    description: "Dünkü maçtan müthiş bir röveşata.",
    thumbnail: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800",
    views: 4560,
    likes: 345,
    isLiked: false,
    isSaved: false,
    time: "12 saat önce",
    qorsScore: BOT_USERS[4].qorsScore,
    badge: "🔥 Viral Gol",
    comments: [
      {
        id: "c7",
        user: BOT_USERS[3].name,
        userId: BOT_USERS[3].id,
        avatar: BOT_USERS[3].avatar,
        text: "Bu nasıl bir gol be! 🔥",
        time: "11 saat önce"
      },
      {
        id: "c8",
        user: BOT_USERS[2].name,
        userId: BOT_USERS[2].id,
        avatar: BOT_USERS[2].avatar,
        text: "Puskas adayı!",
        time: "10 saat önce"
      }
    ],
  },
  {
    id: "post-11",
    type: 'status',
    category: 'tactics',
    user: BOT_USERS[5].name,
    userId: BOT_USERS[5].id,
    avatar: BOT_USERS[5].avatar,
    title: "Orta saha baskısında en önemli şey zamanlama. Rakip kaleciden çıkış yaparken baskıya çıkmak çok kritik 🧠",
    views: 432,
    likes: 56,
    isLiked: false,
    isSaved: false,
    time: "4 saat önce",
    qorsScore: BOT_USERS[5].qorsScore,
    tags: ["Taktik", "Pressing", "Orta Saha"],
    comments: [],
  },
  {
    id: "post-12",
    type: 'transfer',
    category: 'lmg',
    user: BOT_USERS[1].name,
    userId: BOT_USERS[1].id,
    avatar: BOT_USERS[1].avatar,
    title: "Cumartesi günü düzenli maç grubu kuruyoruz",
    description: "Her Cumartesi 10:00-12:00 arası Levent'te maç. Düzenli katılım şart. Kaleci ve 2 defans arıyoruz.",
    location: "Levent, Kanyon Arkası",
    timeSpec: "Her Cumartesi 10:00",
    price: "70₺/hafta",
    subType: "oyuncu",
    views: 567,
    likes: 89,
    isLiked: false,
    isSaved: false,
    time: "2 gün önce",
    qorsScore: BOT_USERS[1].qorsScore,
    comments: [
      {
        id: "c9",
        user: BOT_USERS[0].name,
        userId: BOT_USERS[0].id,
        avatar: BOT_USERS[0].avatar,
        text: "Kaleci olarak ilgileniyorum, detay verir misin?",
        time: "1 gün önce"
      }
    ],
  },
  {
    id: "post-13",
    type: 'lineup',
    category: 'tactics',
    user: BOT_USERS[2].name,
    userId: BOT_USERS[2].id,
    avatar: BOT_USERS[2].avatar,
    title: "3-5-2 ile savunmada sağlamlık 🛡️",
    description: "Bu dizilişte kanat-bekler çok önemli. Hem savunma hem hücuma katkı vermeli.",
    formation: "3-5-2",
    views: 678,
    likes: 78,
    isLiked: false,
    isSaved: false,
    time: "1 gün önce",
    qorsScore: BOT_USERS[2].qorsScore,
    tags: ["Taktik", "3-5-2", "Savunma"],
    comments: [],
  },
  {
    id: "post-14",
    type: 'status',
    category: 'all',
    user: BOT_USERS[0].name,
    userId: BOT_USERS[0].id,
    avatar: BOT_USERS[0].avatar,
    title: "10 yıldır kaleci oynuyorum, ama dün ilk golümü attım! Köşe vuruşundan kafa golü 🎉",
    thumbnail: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=800",
    views: 1890,
    likes: 234,
    isLiked: false,
    isSaved: false,
    time: "16 saat önce",
    qorsScore: BOT_USERS[0].qorsScore,
    comments: [
      {
        id: "c10",
        user: BOT_USERS[3].name,
        userId: BOT_USERS[3].id,
        avatar: BOT_USERS[3].avatar,
        text: "Artık golcü olarak da oynarsın 😂",
        time: "15 saat önce"
      }
    ],
  },
];

// Sample notifications
export const SAMPLE_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: 'match_rating',
    title: 'Maç Değerlendirmesi',
    message: 'Dünkü maçtaki performansını değerlendir!',
    time: '5 dakika önce',
    isRead: false,
  },
  {
    id: "n2",
    type: 'like',
    title: 'Yeni Beğeni',
    message: 'gönderini beğendi',
    user: BOT_USERS[2].name,
    avatar: BOT_USERS[2].avatar,
    time: '15 dakika önce',
    isRead: false,
  },
  {
    id: "n3",
    type: 'comment',
    title: 'Yeni Yorum',
    message: 'gönderine yorum yaptı: "Harika performans!"',
    user: BOT_USERS[3].name,
    avatar: BOT_USERS[3].avatar,
    time: '1 saat önce',
    isRead: true,
  },
  {
    id: "n4",
    type: 'match_star',
    title: 'Maçın Yıldızı!',
    message: 'Dünkü maçta maçın yıldızı seçildin! ⭐',
    time: '2 saat önce',
    isRead: true,
  },
  {
    id: "n5",
    type: 'system',
    title: 'Hoş Geldin!',
    message: 'Qors ailesine katıldığın için teşekkürler!',
    time: '1 gün önce',
    isRead: true,
  },
  {
    id: "n6",
    type: 'like',
    title: 'Yeni Beğeni',
    message: 'gönderini beğendi',
    user: BOT_USERS[0].name,
    avatar: BOT_USERS[0].avatar,
    time: '30 dakika önce',
    isRead: false,
  },
  {
    id: "n7",
    type: 'comment',
    title: 'Yeni Yorum',
    message: 'profiline yorum bıraktı: "Harika takım arkadaşı!"',
    user: BOT_USERS[5].name,
    avatar: BOT_USERS[5].avatar,
    time: '3 saat önce',
    isRead: false,
  },
  {
    id: "n8",
    type: 'system',
    title: 'Yeni Takipçi',
    message: 'seni takip etmeye başladı',
    user: BOT_USERS[4].name,
    avatar: BOT_USERS[4].avatar,
    time: '4 saat önce',
    isRead: true,
  },
];

// Trending topics
export const TRENDING_TOPICS = [
  { tag: '#HalıSaha', posts: '2.4K' },
  { tag: '#AmatörLig', posts: '1.8K' },
  { tag: '#MaçBul', posts: '1.2K' },
  { tag: '#Taktik', posts: '890' },
  { tag: '#GolKralı', posts: '756' },
  { tag: '#LMG', posts: '623' },
  { tag: '#Kaleci', posts: '445' },
  { tag: '#İstanbul', posts: '3.1K' },
];

// Upcoming matches
export const UPCOMING_MATCHES = [
  { teams: 'FC Mahalle vs Yıldızlar', time: 'Bugün 20:00', location: 'Etiler' },
  { teams: 'Kartal SK vs Beşiktaş', time: 'Yarın 19:00', location: 'Kadıköy' },
  { teams: 'Şişli United vs Beyoğlu', time: 'Çarşamba 21:00', location: 'Şişli' },
  { teams: 'Levent FC vs Maslak', time: 'Perşembe 20:30', location: 'Levent' },
  { teams: 'Ataşehir vs Üsküdar', time: 'Cuma 19:00', location: 'Ataşehir' },
];

// Popular locations
export const POPULAR_LOCATIONS = [
  { name: 'Kadıköy', matches: 45 },
  { name: 'Beşiktaş', matches: 38 },
  { name: 'Şişli', matches: 32 },
  { name: 'Ataşehir', matches: 28 },
  { name: 'Levent', matches: 25 },
  { name: 'Etiler', matches: 22 },
];

// Helper functions
export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Az önce';
  if (diffMins < 60) return `${diffMins} dakika önce`;
  if (diffHours < 24) return `${diffHours} saat önce`;
  if (diffDays < 7) return `${diffDays} gün önce`;
  return date.toLocaleDateString('tr-TR');
}

export function formatViews(views: number): string {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return views.toString();
}

export function getScoreColor(score: number): string {
  if (score >= 9) return 'text-primary';
  if (score >= 7) return 'text-success';
  if (score >= 5) return 'text-warning';
  return 'text-destructive';
}

export function getReliabilityBadge(reliability: string): { color: string; bg: string } {
  switch (reliability) {
    case 'Efsane': return { color: 'text-gold', bg: 'bg-gold/20' };
    case 'Elit': return { color: 'text-primary', bg: 'bg-primary/20' };
    case 'Pro': return { color: 'text-info', bg: 'bg-info/20' };
    case 'Güvenilir': return { color: 'text-success', bg: 'bg-success/20' };
    default: return { color: 'text-muted-foreground', bg: 'bg-muted' };
  }
}
