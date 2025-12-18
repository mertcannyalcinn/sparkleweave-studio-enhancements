import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, MessageCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
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
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }
    
    if (user) {
      fetchConversations();
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (conversationId && user) {
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
  }, [conversationId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`participant_1.eq.${user!.id},participant_2.eq.${user!.id}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        // Get other participants' profiles
        const otherUserIds = data.map(c => 
          c.participant_1 === user!.id ? c.participant_2 : c.participant_1
        );
        
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, name, avatar_url, handle')
          .in('user_id', otherUserIds);

        const profileMap = new Map(profiles?.map(p => [p.user_id, p]));

        // Get last messages
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

        const conversationsWithProfiles = data.map(conv => ({
          ...conv,
          other_profile: profileMap.get(
            conv.participant_1 === user!.id ? conv.participant_2 : conv.participant_1
          ),
          last_message: lastMessageMap.get(conv.id)
        }));

        setConversations(conversationsWithProfiles);

        // Set selected conversation if URL has conversationId
        if (conversationId) {
          const selected = conversationsWithProfiles.find(c => c.id === conversationId);
          setSelectedConversation(selected || null);
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

      // Mark messages as read
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
      
      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const selectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
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
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full hover:bg-surface flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Mesajlar</h1>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Henüz mesajınız yok</p>
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
                <img
                  src={conv.other_profile?.avatar_url || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200'}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full object-cover"
                />
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
            {/* Chat Header */}
            <div className="p-4 border-b border-border flex items-center gap-3 bg-card">
              <button
                onClick={() => navigate('/messages')}
                className="md:hidden w-10 h-10 rounded-full hover:bg-surface flex items-center justify-center transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate(`/profile/${
                  selectedConversation.participant_1 === user!.id 
                    ? selectedConversation.participant_2 
                    : selectedConversation.participant_1
                }`)}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <img
                  src={selectedConversation.other_profile?.avatar_url || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200'}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="text-left">
                  <p className="font-medium">{selectedConversation.other_profile?.name || 'Kullanıcı'}</p>
                  <p className="text-xs text-muted-foreground">{selectedConversation.other_profile?.handle}</p>
                </div>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
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

            {/* Message Input */}
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
              <p className="text-sm mt-2">Bir sohbet seçin veya yeni bir mesaj başlatın</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
