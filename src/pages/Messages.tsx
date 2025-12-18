import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, MessageCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { BOT_USERS } from '@/lib/data';
import { 
  getBotConversations, 
  getBotConversationById, 
  createBotConversation,
  sendBotMessage,
  simulateBotResponse,
  isBotUser,
  BotConversation,
  BotMessage 
} from '@/lib/botMessaging';
import { cn } from '@/lib/utils';

interface Conversation {
  id: string;
  participant_1: string;
  participant_2: string;
  updated_at: string;
  other_profile?: {
    name: string | null;
    avatar_url: string | null;
    handle: string | null;
  };
  last_message?: string;
  isBot?: boolean;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export default function Messages() {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isBotConversation, setIsBotConversation] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }
    
    if (user) {
      fetchAllConversations();
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (conversationId && user) {
      // Check if it's a bot conversation
      if (conversationId.startsWith('bot-conv-')) {
        setIsBotConversation(true);
        loadBotConversation(conversationId);
      } else {
        setIsBotConversation(false);
        fetchMessages(conversationId);
        
        // Subscribe to new messages
        const channel = supabase
          .channel(`messages-${conversationId}`)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'messages',
              filter: `conversation_id=eq.${conversationId}`
            },
            (payload) => {
              setMessages(prev => [...prev, payload.new as Message]);
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      }
    }
  }, [conversationId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadBotConversation = (convId: string) => {
    const botConv = getBotConversationById(convId);
    if (botConv) {
      const botUser = BOT_USERS.find(b => b.id === botConv.botId);
      setSelectedConversation({
        id: botConv.id,
        participant_1: botConv.participantId,
        participant_2: botConv.botId,
        updated_at: botConv.updatedAt,
        other_profile: botUser ? {
          name: botUser.name,
          avatar_url: botUser.avatar,
          handle: botUser.handle,
        } : null,
        isBot: true,
      });
      setMessages(botConv.messages.map(m => ({
        id: m.id,
        conversation_id: m.conversationId,
        sender_id: m.senderId,
        content: m.content,
        is_read: m.isRead,
        created_at: m.createdAt,
      })));
    }
  };

  const fetchAllConversations = async () => {
    try {
      // Fetch real conversations
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`participant_1.eq.${user!.id},participant_2.eq.${user!.id}`)
        .order('updated_at', { ascending: false });

      let allConversations: Conversation[] = [];

      if (data && data.length > 0) {
        const otherUserIds = data.map(c => 
          c.participant_1 === user!.id ? c.participant_2 : c.participant_1
        );
        
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, name, avatar_url, handle')
          .in('user_id', otherUserIds);

        const profileMap = new Map(profiles?.map(p => [p.user_id, p]));

        const { data: lastMessages } = await supabase
          .from('messages')
          .select('conversation_id, content')
          .in('conversation_id', data.map(c => c.id))
          .order('created_at', { ascending: false });

        const lastMessageMap = new Map<string, string>();
        lastMessages?.forEach(m => {
          if (!lastMessageMap.has(m.conversation_id)) {
            lastMessageMap.set(m.conversation_id, m.content);
          }
        });

        allConversations = data.map(conv => ({
          ...conv,
          other_profile: profileMap.get(
            conv.participant_1 === user!.id ? conv.participant_2 : conv.participant_1
          ),
          last_message: lastMessageMap.get(conv.id),
          isBot: false,
        }));
      }

      // Add bot conversations
      const botConvs = getBotConversations(user!.id);
      const botConversations: Conversation[] = botConvs.map(bc => {
        const botUser = BOT_USERS.find(b => b.id === bc.botId);
        return {
          id: bc.id,
          participant_1: bc.participantId,
          participant_2: bc.botId,
          updated_at: bc.updatedAt,
          other_profile: botUser ? {
            name: botUser.name,
            avatar_url: botUser.avatar,
            handle: botUser.handle,
          } : null,
          last_message: bc.messages.length > 0 ? bc.messages[bc.messages.length - 1].content : undefined,
          isBot: true,
        };
      });

      // Merge and sort by updated_at
      allConversations = [...allConversations, ...botConversations]
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

      setConversations(allConversations);

      // Set selected conversation if URL has conversationId
      if (conversationId) {
        const selected = allConversations.find(c => c.id === conversationId);
        if (selected) {
          setSelectedConversation(selected);
          setIsBotConversation(selected.isBot || false);
        }
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (convId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);

      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', convId)
        .neq('sender_id', user!.id);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversationId || !user) return;

    setSending(true);
    
    if (isBotConversation) {
      // Handle bot message
      try {
        const userMsg = sendBotMessage(conversationId, user.id, newMessage.trim());
        setMessages(prev => [...prev, {
          id: userMsg.id,
          conversation_id: userMsg.conversationId,
          sender_id: userMsg.senderId,
          content: userMsg.content,
          is_read: userMsg.isRead,
          created_at: userMsg.createdAt,
        }]);
        setNewMessage('');

        // Simulate bot response after a short delay
        const botConv = getBotConversationById(conversationId);
        if (botConv) {
          setTimeout(() => {
            const botMsg = simulateBotResponse(conversationId, botConv.botId);
            setMessages(prev => [...prev, {
              id: botMsg.id,
              conversation_id: botMsg.conversationId,
              sender_id: botMsg.senderId,
              content: botMsg.content,
              is_read: botMsg.isRead,
              created_at: botMsg.createdAt,
            }]);
          }, 1000 + Math.random() * 2000);
        }
      } catch (error) {
        console.error('Error sending bot message:', error);
      }
    } else {
      // Handle real message
      try {
        const { error } = await supabase
          .from('messages')
          .insert({
            conversation_id: conversationId,
            sender_id: user.id,
            content: newMessage.trim()
          });

        if (error) throw error;
        
        setNewMessage('');
        
        await supabase
          .from('conversations')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', conversationId);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
    
    setSending(false);
  };

  const selectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    setIsBotConversation(conv.isBot || false);
    navigate(`/messages/${conv.id}`);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Şimdi';
    if (minutes < 60) return `${minutes} dk`;
    if (hours < 24) return `${hours} sa`;
    if (days < 7) return `${days} gün`;
    return date.toLocaleDateString('tr-TR');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Conversations List */}
      <div className={cn(
        "w-full md:w-80 bg-card border-r border-border flex flex-col",
        conversationId && "hidden md:flex"
      )}>
        <div className="p-4 border-b border-border flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full hover:bg-surface flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Mesajlar</h1>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Henüz mesajınız yok</p>
              <p className="text-sm mt-2">Bir oyuncunun profiline gidip mesaj gönderebilirsiniz</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => selectConversation(conv)}
                className={cn(
                  "w-full p-4 flex items-center gap-3 hover:bg-surface transition-colors border-b border-border/50",
                  conv.id === conversationId && "bg-surface"
                )}
              >
                <div className="relative">
                  <img
                    src={conv.other_profile?.avatar_url || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200'}
                    alt="Avatar"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {conv.isBot && (
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center text-[8px] text-primary-foreground font-bold">
                      🤖
                    </span>
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="font-medium truncate">
                    {conv.other_profile?.name || 'Kullanıcı'}
                  </p>
                  {conv.last_message && (
                    <p className="text-sm text-muted-foreground truncate">
                      {conv.last_message}
                    </p>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatTime(conv.updated_at)}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={cn(
        "flex-1 flex flex-col",
        !conversationId && "hidden md:flex"
      )}>
        {conversationId && selectedConversation ? (
          <>
            <div className="p-4 border-b border-border flex items-center gap-3 bg-card">
              <button
                onClick={() => navigate('/messages')}
                className="md:hidden w-10 h-10 rounded-full hover:bg-surface flex items-center justify-center transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate(`/profile/${selectedConversation.participant_2}`)}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <div className="relative">
                  <img
                    src={selectedConversation.other_profile?.avatar_url || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200'}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {isBotConversation && (
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center text-[8px]">
                      🤖
                    </span>
                  )}
                </div>
                <div className="text-left">
                  <p className="font-medium">{selectedConversation.other_profile?.name || 'Kullanıcı'}</p>
                  <p className="text-xs text-muted-foreground">{selectedConversation.other_profile?.handle}</p>
                </div>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Henüz mesaj yok</p>
                  <p className="text-sm">İlk mesajı sen gönder!</p>
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex",
                    msg.sender_id === user!.id ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[70%] px-4 py-2 rounded-2xl",
                      msg.sender_id === user!.id
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-surface rounded-bl-md"
                    )}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className={cn(
                      "text-[10px] mt-1",
                      msg.sender_id === user!.id ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}>
                      {formatTime(msg.created_at)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-card">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Mesaj yaz..."
                  className="flex-1 px-4 py-3 bg-surface rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <Button type="submit" disabled={!newMessage.trim() || sending}>
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl font-medium">Mesajlarınız</p>
              <p className="text-sm mt-2">Bir sohbet seçin veya bir oyuncunun profilinden mesaj gönderin</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
