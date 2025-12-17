import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Target, Users, Star, Calendar, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface MatchParticipant {
  id: string;
  match_id: string;
  team: string;
  goals: number;
  assists: number;
  is_mvp: boolean;
  matches: {
    id: string;
    match_date: string;
    location: string | null;
    home_team_score: number;
    away_team_score: number;
    status: string;
  };
}

interface PlayerRating {
  id: string;
  position: string;
  skill_1: number;
  skill_2: number;
  skill_3: number;
  skill_4: number;
  sportsmanship: number;
  reliability: number;
  teamwork: number;
  communication: number;
  average_rating: number;
  comment: string | null;
  created_at: string;
}

export default function MatchHistory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<MatchParticipant[]>([]);
  const [ratings, setRatings] = useState<PlayerRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMatches: 0,
    totalGoals: 0,
    totalAssists: 0,
    mvpCount: 0,
    averageRating: 0,
  });

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    if (!user) return;

    setLoading(true);
    
    // Fetch match participations
    const { data: matchData } = await supabase
      .from("match_participants")
      .select(`
        id,
        match_id,
        team,
        goals,
        assists,
        is_mvp,
        matches (
          id,
          match_date,
          location,
          home_team_score,
          away_team_score,
          status
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    // Fetch ratings received
    const { data: ratingData } = await supabase
      .from("player_ratings")
      .select("*")
      .eq("rated_user_id", user.id)
      .order("created_at", { ascending: false });

    if (matchData) {
      setMatches(matchData as unknown as MatchParticipant[]);
      
      // Calculate stats
      const totalGoals = matchData.reduce((sum, m) => sum + (m.goals || 0), 0);
      const totalAssists = matchData.reduce((sum, m) => sum + (m.assists || 0), 0);
      const mvpCount = matchData.filter(m => m.is_mvp).length;
      
      setStats(prev => ({
        ...prev,
        totalMatches: matchData.length,
        totalGoals,
        totalAssists,
        mvpCount,
      }));
    }

    if (ratingData) {
      setRatings(ratingData);
      const avgRating = ratingData.length > 0 
        ? ratingData.reduce((sum, r) => sum + r.average_rating, 0) / ratingData.length 
        : 0;
      setStats(prev => ({ ...prev, averageRating: avgRating }));
    }

    setLoading(false);
  };

  const getMatchResult = (match: MatchParticipant) => {
    const { home_team_score, away_team_score } = match.matches;
    const isHome = match.team === "home";
    const myScore = isHome ? home_team_score : away_team_score;
    const opponentScore = isHome ? away_team_score : home_team_score;
    
    if (myScore > opponentScore) return "win";
    if (myScore < opponentScore) return "loss";
    return "draw";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Maç Geçmişi & İstatistikler</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Card className="bg-card">
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{stats.totalMatches}</p>
              <p className="text-xs text-muted-foreground">Maç</p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="p-4 text-center">
              <Target className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold">{stats.totalGoals}</p>
              <p className="text-xs text-muted-foreground">Gol</p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold">{stats.totalAssists}</p>
              <p className="text-xs text-muted-foreground">Asist</p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="p-4 text-center">
              <Trophy className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
              <p className="text-2xl font-bold">{stats.mvpCount}</p>
              <p className="text-xs text-muted-foreground">MVP</p>
            </CardContent>
          </Card>
          <Card className="bg-card col-span-2 md:col-span-1">
            <CardContent className="p-4 text-center">
              <Star className="h-6 w-6 mx-auto mb-2 text-orange-500" />
              <p className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">Ort. Puan</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="matches" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="matches">Maçlar</TabsTrigger>
            <TabsTrigger value="ratings">Aldığın Puanlar</TabsTrigger>
          </TabsList>

          <TabsContent value="matches" className="space-y-3 mt-4">
            {loading ? (
              <Card className="p-8 text-center text-muted-foreground">
                Yükleniyor...
              </Card>
            ) : matches.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground">
                Henüz maç kaydı yok
              </Card>
            ) : (
              matches.map((match) => {
                const result = getMatchResult(match);
                return (
                  <Card key={match.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(match.matches.match_date), "d MMMM yyyy", { locale: tr })}
                        </div>
                        <Badge 
                          variant={result === "win" ? "default" : result === "loss" ? "destructive" : "secondary"}
                        >
                          {result === "win" ? "Galibiyet" : result === "loss" ? "Mağlubiyet" : "Beraberlik"}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-center gap-4 mb-3">
                        <span className="text-lg font-semibold">
                          {match.team === "home" ? "Ev Sahibi" : "Deplasman"}
                        </span>
                        <span className="text-2xl font-bold">
                          {match.matches.home_team_score} - {match.matches.away_team_score}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Target className="h-4 w-4 text-green-500" />
                            {match.goals} gol
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-blue-500" />
                            {match.assists} asist
                          </span>
                        </div>
                        {match.is_mvp && (
                          <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                            <Trophy className="h-3 w-3 mr-1" />
                            MVP
                          </Badge>
                        )}
                      </div>

                      {match.matches.location && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {match.matches.location}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="ratings" className="space-y-3 mt-4">
            {loading ? (
              <Card className="p-8 text-center text-muted-foreground">
                Yükleniyor...
              </Card>
            ) : ratings.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground">
                Henüz puan almadın
              </Card>
            ) : (
              ratings.map((rating) => (
                <Card key={rating.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        {rating.position === "goalkeeper" && "Kaleci"}
                        {rating.position === "defender" && "Defans"}
                        {rating.position === "midfielder" && "Orta Saha"}
                        {rating.position === "forward" && "Forvet"}
                      </CardTitle>
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        <span className="text-lg font-bold">{rating.average_rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(rating.created_at!), "d MMMM yyyy", { locale: tr })}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sportmenlik</span>
                        <span className="font-medium">{rating.sportsmanship}/10</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Güvenilirlik</span>
                        <span className="font-medium">{rating.reliability}/10</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Takım Oyunu</span>
                        <span className="font-medium">{rating.teamwork}/10</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">İletişim</span>
                        <span className="font-medium">{rating.communication}/10</span>
                      </div>
                    </div>
                    {rating.comment && (
                      <p className="text-sm text-muted-foreground italic border-t pt-2">
                        "{rating.comment}"
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
