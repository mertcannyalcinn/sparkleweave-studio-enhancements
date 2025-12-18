import { BOT_USERS } from '@/lib/data';

export interface BotMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface BotConversation {
  id: string;
  participantId: string; // current user
  botId: string;
  messages: BotMessage[];
  updatedAt: string;
}

const STORAGE_KEY = 'qors_bot_conversations';

// Bot response templates
const BOT_RESPONSES: Record<string, string[]> = {
  'bot-1': [
    'Merhaba! Kaleci olarak yardımcı olabileceğim bir şey var mı? 🧤',
    'Bir sonraki maça hazırım! Ne zaman buluşuyoruz?',
    'Antrenmanlara devam ediyorum, formumu korumaya çalışıyorum.',
    'Geçen maçtaki penaltı kurtarışını gördün mü? 😎',
  ],
  'bot-2': [
    'Selam! Defansta güvenebileceğin birini arıyorsan buradayım 🛡️',
    'Hafta sonu maç var mı? Katılmak isterim.',
    'Takım olarak iyi çalışıyoruz, devam edelim!',
    'Top çıkarmayı seven bir stoperim, biliyorsun.',
  ],
  'bot-3': [
    'Hey! Orta sahada koordinasyon sağlayabilirim 👑',
    'Maç organizasyonu yapacaksanız haber verin.',
    'Asist atmayı çok seviyorum, forvet lazımsa ben buradayım!',
    'Bu hafta 3 maç oynadım, hala enerjim yerinde.',
  ],
  'bot-4': [
    'Golcü lazımsa yazın! ⚽️',
    'Her pozisyondan vururum, merak etme.',
    'Hat-trick için hazırım, sadece pas ver!',
    'Geçen haftaki maçta 3 gol attım, iyi gidiyorum.',
  ],
  'bot-5': [
    'Hızlı kanat oyuncusu arıyorsanız ben buradayım 💨',
    'Genç ve enerjik! Her maça açığım.',
    'Çalımlarımla fark yaratırım.',
    'Antrenmana devam, daha iyisi için çalışıyorum!',
  ],
  'bot-6': [
    'Orta saha motoru olarak hizmetinizdeyim 🔥',
    'Koşmayı ve top kapmayı seviyorum.',
    'Takımın her yerinde olabilirim.',
    'Bu sezon formumu buldum, devam!',
  ],
};

export function getBotConversations(userId: string): BotConversation[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const all = JSON.parse(stored) as BotConversation[];
    return all.filter(c => c.participantId === userId);
  } catch {
    return [];
  }
}

export function getBotConversation(userId: string, botId: string): BotConversation | null {
  const conversations = getBotConversations(userId);
  return conversations.find(c => c.botId === botId) || null;
}

export function getBotConversationById(conversationId: string): BotConversation | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const all = JSON.parse(stored) as BotConversation[];
    return all.find(c => c.id === conversationId) || null;
  } catch {
    return null;
  }
}

export function createBotConversation(userId: string, botId: string): BotConversation {
  const conversation: BotConversation = {
    id: `bot-conv-${botId}-${Date.now()}`,
    participantId: userId,
    botId,
    messages: [],
    updatedAt: new Date().toISOString(),
  };
  
  saveBotConversation(conversation);
  return conversation;
}

function saveBotConversation(conversation: BotConversation) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    let all: BotConversation[] = stored ? JSON.parse(stored) : [];
    
    const index = all.findIndex(c => c.id === conversation.id);
    if (index >= 0) {
      all[index] = conversation;
    } else {
      all.push(conversation);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (error) {
    console.error('Error saving bot conversation:', error);
  }
}

export function sendBotMessage(conversationId: string, senderId: string, content: string): BotMessage {
  const conversation = getBotConversationById(conversationId);
  if (!conversation) throw new Error('Conversation not found');
  
  const message: BotMessage = {
    id: `msg-${Date.now()}`,
    conversationId,
    senderId,
    content,
    isRead: true,
    createdAt: new Date().toISOString(),
  };
  
  conversation.messages.push(message);
  conversation.updatedAt = new Date().toISOString();
  saveBotConversation(conversation);
  
  return message;
}

export function getBotResponse(botId: string): string {
  const responses = BOT_RESPONSES[botId] || [
    'Merhaba! Nasılsın?',
    'Maç için hazırım!',
    'İyi oyunlar dilerim!',
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

export function simulateBotResponse(conversationId: string, botId: string): BotMessage {
  const conversation = getBotConversationById(conversationId);
  if (!conversation) throw new Error('Conversation not found');
  
  const response: BotMessage = {
    id: `msg-${Date.now()}-bot`,
    conversationId,
    senderId: botId,
    content: getBotResponse(botId),
    isRead: false,
    createdAt: new Date().toISOString(),
  };
  
  conversation.messages.push(response);
  conversation.updatedAt = new Date().toISOString();
  saveBotConversation(conversation);
  
  return response;
}

export function isBotUser(userId: string): boolean {
  return BOT_USERS.some(b => b.id === userId);
}

export function getBotUser(userId: string) {
  return BOT_USERS.find(b => b.id === userId);
}

// Bot Ratings System
const BOT_RATINGS_KEY = 'qors_bot_ratings';

export interface BotRating {
  id: string;
  rated_user_id: string;
  rater_id: string;
  rater_name: string;
  rater_avatar: string;
  average_rating: number;
  skill_1: number;
  skill_2: number;
  skill_3: number;
  skill_4: number;
  sportsmanship: number;
  reliability: number;
  teamwork: number;
  communication: number;
  position: string;
  comment?: string;
  created_at: string;
}

export function getBotRatings(): BotRating[] {
  try {
    const stored = localStorage.getItem(BOT_RATINGS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveBotRating(rating: Omit<BotRating, 'id' | 'created_at'>): BotRating {
  const ratings = getBotRatings();
  const newRating: BotRating = {
    ...rating,
    id: `bot-rating-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  ratings.unshift(newRating);
  localStorage.setItem(BOT_RATINGS_KEY, JSON.stringify(ratings));
  return newRating;
}

export function getRatingsForBot(botUserId: string): BotRating[] {
  const ratings = getBotRatings();
  return ratings.filter(r => r.rated_user_id === botUserId);
}
