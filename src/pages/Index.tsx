import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Home, Search, Bell, User, BookOpen, AlertCircle, LogOut, Loader2, History, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '@/contexts/AuthContext';
import { saveBotRating, isBotUser } from '@/lib/botMessaging';
import { NavIcon } from '@/components/NavIcon';
import { Header } from '@/components/Header';
import { PostComposer } from '@/components/PostComposer';
import { PostCard } from '@/components/PostCard';
import { RightSidebar } from '@/components/RightSidebar';
import { NotificationsDropdown } from '@/components/NotificationsDropdown';
import { CreateMatchModal } from '@/components/modals/CreateMatchModal';
import { PlayerRatingModal } from '@/components/modals/PlayerRatingModal';
import { JoinMatchModal, JoinMatchData } from '@/components/modals/JoinMatchModal';
import { SearchView } from '@/components/sections/SearchView';
import { AcademyView } from '@/components/sections/AcademyView';
import { LMGView } from '@/components/sections/LMGView';

import { 
  SAMPLE_POSTS, 
  BOT_USERS, 
  Post, 
  Position,
  User as UserType,
} from '@/lib/data';

type NavSection = 'home' | 'search' | 'academy' | 'lmg' | 'notifications' | 'profile';

export default function Index() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  
  // State
  const [posts, setPosts] = useState<Post[]>(SAMPLE_POSTS);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeNav, setActiveNav] = useState<NavSection>('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [newPostText, setNewPostText] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Current user from auth
  const currentUser: UserType = {
    id: user?.id || 'guest',
    name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Kullanıcı',
    handle: `@${user?.email?.split('@')[0] || 'kullanici'}`,
    avatar: user?.user_metadata?.avatar_url || user?.user_metadata?.picture || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200',
    cover: 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?auto=format&fit=crop&q=80&w=1200',
    qorsScore: 5.0,
    fairPlayBadge: false,
    matchesPlayed: 0,
    reliability: 'Yeni',
    role: 'Oyuncu',
    bio: 'Futbol tutkunu',
    position: 'midfielder',
    stats: { mvp: 0, goals: 0, assists: 0 },
    followers: 0,
    following: 0,
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground mt-4">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Filter posts
  const filteredPosts = posts.filter((p) => {
    const categoryMatch = activeCategory === 'all' 
      ? true 
      : activeCategory === 'lmg' 
        ? p.category === 'lmg' || p.urgency === 'Acil' 
        : p.category === activeCategory;
    const searchMatch = searchTerm === '' 
      ? true 
      : p.title.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  // Handlers
  const handleLike = (postId: string) => {
    setPosts(posts.map(p => 
      p.id === postId 
        ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
        : p
    ));
  };

  const handleSave = (postId: string) => {
    setPosts(posts.map(p => 
      p.id === postId 
        ? { ...p, isSaved: !p.isSaved }
        : p
    ));
    const post = posts.find(p => p.id === postId);
    if (post?.isSaved) {
      toast.success('Kaydedilenlerden çıkarıldı');
    } else {
      toast.success('Kaydedildi!');
    }
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter(p => p.id !== postId));
    toast.success('Gönderi silindi');
  };

  const handleSharePost = (imageUrl?: string) => {
    if (!newPostText.trim()) return;
    
    const newPost: Post = {
      id: `post-${Date.now()}`,
      type: 'status',
      category: 'all',
      user: currentUser.name,
      userId: currentUser.id,
      avatar: currentUser.avatar,
      title: newPostText,
      thumbnail: imageUrl,
      likes: 0,
      isLiked: false,
      isSaved: false,
      time: 'Az önce',
      qorsScore: currentUser.qorsScore,
      comments: [],
    };
    
    setPosts([newPost, ...posts]);
    setNewPostText('');
    toast.success('Paylaşıldı!');
  };

  const handleAddComment = (postId: string, text: string) => {
    setPosts(posts.map(p => 
      p.id === postId 
        ? { 
            ...p, 
            comments: [...p.comments, {
              id: `c-${Date.now()}`,
              user: currentUser.name,
              userId: currentUser.id,
              avatar: currentUser.avatar,
              text,
              time: 'Az önce',
            }]
          }
        : p
    ));
  };

  const handleCreateMatch = (data: any) => {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      type: 'transfer',
      category: 'lmg',
      user: currentUser.name,
      userId: currentUser.id,
      avatar: currentUser.avatar,
      title: data.title,
      description: data.description,
      location: data.location,
      timeSpec: `${data.date} ${data.time}`,
      price: data.price,
      urgency: data.urgency,
      subType: 'oyuncu',
      likes: 0,
      isLiked: false,
      isSaved: false,
      time: 'Az önce',
      qorsScore: currentUser.qorsScore,
      comments: [],
    };
    
    setPosts([newPost, ...posts]);
    toast.success('Maç oluşturuldu!');
  };

  const handlePlayerRatingSubmit = (data: {
    playerId: string;
    position: Position;
    skillRatings: Record<string, number>;
    sportsmanshipRatings: Record<string, number>;
    comment?: string;
  }) => {
    // Save bot ratings to localStorage
    if (isBotUser(data.playerId)) {
      const skillValues = Object.values(data.skillRatings);
      const sportsValues = Object.values(data.sportsmanshipRatings);
      const allValues = [...skillValues, ...sportsValues];
      const averageRating = allValues.reduce((a, b) => a + b, 0) / allValues.length;

      saveBotRating({
        rated_user_id: data.playerId,
        rater_id: currentUser.id,
        rater_name: currentUser.name,
        rater_avatar: currentUser.avatar,
        average_rating: averageRating,
        skill_1: skillValues[0] || 5,
        skill_2: skillValues[1] || 5,
        skill_3: skillValues[2] || 5,
        skill_4: skillValues[3] || 5,
        sportsmanship: data.sportsmanshipRatings.sportsmanship,
        reliability: data.sportsmanshipRatings.reliability,
        teamwork: data.sportsmanshipRatings.teamwork,
        communication: data.sportsmanshipRatings.communication,
        position: data.position,
        comment: data.comment,
      });
    }
  };

  const handleNavClick = (navId: string) => {
    if (navId !== 'notifications') {
      setShowNotifications(false);
    }
    setActiveNav(navId as NavSection);
  };

  const handleNotificationsClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      setActiveNav('notifications');
    }
  };

  const handleUserClick = (userId: string) => {
    // Navigate to profile page
    navigate(`/profile/${userId}`);
  };

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    setActiveNav('home');
  };

  const handleSignOut = async () => {
    toast.info('Çıkış yapılıyor...');
    await signOut();
    navigate('/auth');
  };

  const handleJoinClick = (post: Post) => {
    setSelectedPost(post);
    setIsJoinModalOpen(true);
  };

  const handleJoinSubmit = (data: JoinMatchData) => {
    console.log('Join match data:', data);
    toast.success('Başvurunuz iletildi!');
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex overflow-hidden">
      {/* Modals */}
      {isCreateModalOpen && (
        <CreateMatchModal 
          onClose={() => setIsCreateModalOpen(false)} 
          onSubmit={handleCreateMatch} 
        />
      )}
      {isRatingModalOpen && (
        <PlayerRatingModal 
          onClose={() => setIsRatingModalOpen(false)} 
          onSubmit={handlePlayerRatingSubmit}
        />
      )}
      <JoinMatchModal
        isOpen={isJoinModalOpen}
        onClose={() => {
          setIsJoinModalOpen(false);
          setSelectedPost(null);
        }}
        post={selectedPost}
        onSubmit={handleJoinSubmit}
      />

      {/* Left Sidebar */}
      <aside className="w-20 bg-card flex flex-col items-center py-6 border-r border-border z-20 shrink-0">
        {/* Logo */}
        <button 
          onClick={() => { setActiveNav('home'); setActiveCategory('all'); }}
          className="mb-8 group"
        >
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-glow animate-pulse-glow group-hover:scale-110 transition-transform">
            <Trophy className="text-primary-foreground w-7 h-7" strokeWidth={2.5} />
          </div>
        </button>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-2 w-full">
          <NavIcon 
            icon={Home} 
            label="Anasayfa" 
            id="home" 
            activeNav={activeNav} 
            onClick={handleNavClick} 
          />
          <NavIcon 
            icon={Search} 
            label="Keşfet" 
            id="search" 
            activeNav={activeNav} 
            onClick={handleNavClick} 
          />
          <NavIcon 
            icon={BookOpen} 
            label="Qors Akademi" 
            id="academy" 
            activeNav={activeNav} 
            onClick={handleNavClick} 
          />
          <NavIcon 
            icon={AlertCircle} 
            label="LMG (Acil)" 
            id="lmg" 
            activeNav={activeNav} 
            onClick={handleNavClick} 
          />
          
          {/* Notifications with Dropdown */}
          <div className="relative w-full" onClick={(e) => e.stopPropagation()}>
            <NavIcon 
              icon={Bell} 
              label="Bildirimler" 
              id="notifications" 
              activeNav={showNotifications ? 'notifications' : activeNav} 
              onClick={handleNotificationsClick} 
              badge={3} 
            />
            {showNotifications && (
              <NotificationsDropdown 
                onOpenRating={() => {
                  setIsRatingModalOpen(true);
                  setShowNotifications(false);
                }}
                onClose={() => setShowNotifications(false)}
                onPostClick={(postId) => {
                  // Scroll to post or highlight it
                  setActiveNav('home');
                  setActiveCategory('all');
                  setShowNotifications(false);
                  // Highlight the post briefly
                  setTimeout(() => {
                    const postElement = document.querySelector(`[data-post-id="${postId}"]`);
                    if (postElement) {
                      postElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      postElement.classList.add('ring-2', 'ring-primary');
                      setTimeout(() => {
                        postElement.classList.remove('ring-2', 'ring-primary');
                      }, 2000);
                    }
                  }, 100);
                }}
                onUserClick={handleUserClick}
              />
            )}
          </div>

          <NavIcon 
            icon={User} 
            label="Profilim" 
            id="profile" 
            activeNav={activeNav} 
            onClick={() => navigate(`/profile/${currentUser.id}`)} 
          />
          <NavIcon 
            icon={History} 
            label="Maç Geçmişi" 
            id="history" 
            activeNav={activeNav} 
            onClick={() => navigate('/history')} 
          />
          <NavIcon 
            icon={MessageCircle} 
            label="Mesajlar" 
            id="messages" 
            activeNav={activeNav} 
            onClick={() => navigate('/messages')} 
          />
        </nav>

        {/* User Section */}
        <div className="mt-auto space-y-4">
          <button 
            onClick={handleSignOut}
            className="w-10 h-10 rounded-full bg-surface flex items-center justify-center hover:bg-destructive/20 hover:text-destructive transition-all" 
            title="Çıkış Yap"
          >
            <LogOut className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate(`/profile/${currentUser.id}`)}
            className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-border hover:ring-primary transition-all"
          >
            <img 
              src={currentUser.avatar} 
              alt="Profil" 
              className="w-full h-full object-cover" 
            />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto scrollbar-thin" onClick={() => setShowNotifications(false)}>
        {/* Home View */}
        {activeNav === 'home' && (
          <>
            <Header 
              activeCategory={activeCategory} 
              setActiveCategory={setActiveCategory} 
              onOpenModal={() => setIsCreateModalOpen(true)} 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
            />
            <PostComposer 
              newPostText={newPostText} 
              setNewPostText={setNewPostText} 
              onSharePost={handleSharePost} 
              userAvatar={currentUser.avatar} 
            />
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredPosts.length === 0 ? (
                  <div className="col-span-full py-20 text-center text-muted-foreground border-2 border-dashed border-border rounded-2xl">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-xl font-bold">Henüz gönderi yok</p>
                    <p className="text-sm mt-2">İlk gönderiyi sen paylaş!</p>
                  </div>
                ) : (
                  filteredPosts.map((post, index) => (
                    <div 
                      key={post.id} 
                      data-post-id={post.id}
                      className={`stagger-${(index % 6) + 1} transition-all duration-300 rounded-2xl`} 
                      style={{ opacity: 0, animation: 'fadeInUp 0.5s ease-out forwards', animationDelay: `${index * 0.05}s` }}
                    >
                      <PostCard
                        post={post}
                        currentUserId={currentUser.id}
                        onLike={() => handleLike(post.id)}
                        onSave={() => handleSave(post.id)}
                        onDelete={() => handleDeletePost(post.id)}
                        onApply={post.type === 'transfer' ? () => handleJoinClick(post) : undefined}
                        onAddComment={(text) => handleAddComment(post.id, text)}
                        onUserClick={handleUserClick}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {/* Search View */}
        {activeNav === 'search' && (
          <SearchView onCategorySelect={handleCategorySelect} />
        )}

        {/* Academy View */}
        {activeNav === 'academy' && (
          <AcademyView />
        )}

        {/* LMG View */}
        {activeNav === 'lmg' && (
          <LMGView 
            onCreateMatch={() => setIsCreateModalOpen(true)}
            onUserClick={handleUserClick}
          />
        )}

      </main>

      {/* Right Sidebar */}
      <RightSidebar onUserClick={handleUserClick} />
    </div>
  );
}
