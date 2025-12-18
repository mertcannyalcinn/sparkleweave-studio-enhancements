import { useState, useEffect } from 'react';
import { Trophy, Target, Medal, Calendar, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface MatchParticipation {
  id: string;
  match_id: string;
  goals: number | null;
  assists: number | null;
  is_mvp: boolean | null;
  team: string;
  match: {
    id: string;
    match_date: string;
    location: string | null;
    home_team_score: number | null;
    away_team_score: number | null;
    status: string | null;
  };
}

interface ProfileMatchHistoryProps {
  userId: string;
}

export function ProfileMatchHistory({ userId }: ProfileMatchHistoryProps) {
  const [matches, setMatches] = useState<MatchParticipation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, [userId]);

  const fetchMatches = async () => {
    try {
      const { data, error } = await supabase
        .from('match_participants')
        .select(`
          id,
          match_id,
          goals,
          assists,
          is_mvp,
          team,
          match:matches (
            id,
            match_date,
            location,
            home_team_score,
            away_team_score,
            status
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      
      // Type assertion to handle the response
      const typedData = (data || []).map(item => ({
        ...item,
        match: Array.isArray(item.match) ? item.match[0] : item.match
      })) as MatchParticipation[];
      
      setMatches(typedData.filter(m => m.match));
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getMatchResult = (match: MatchParticipation) => {
    const homeScore = match.match.home_team_score || 0;
    const awayScore = match.match.away_team_score || 0;
    const isHome = match.team === 'home';
    const teamScore = isHome ? homeScore : awayScore;
    const opponentScore = isHome ? awayScore : homeScore;

    if (teamScore > opponentScore) return { text: 'G', className: 'bg-success/20 text-success' };
    if (teamScore < opponentScore) return { text: 'M', className: 'bg-destructive/20 text-destructive' };
    return { text: 'B', className: 'bg-warning/20 text-warning' };
  };

  if (loading) {
    return (
      <div className="p-4 border-t border-border">
        <h3 className="text-sm font-semibold mb-3">Maç Geçmişi</h3>
        <div className="text-center py-4 text-muted-foreground text-sm">
          Yükleniyor...
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="p-4 border-t border-border">
        <h3 className="text-sm font-semibold mb-3">Maç Geçmişi</h3>
        <div className="text-center py-4 text-muted-foreground text-sm">
          Henüz maç kaydı yok
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border-t border-border">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <Calendar className="w-4 h-4 text-primary" />
        Son Maçlar
      </h3>
      <div className="space-y-2">
        {matches.map((participation) => {
          const result = getMatchResult(participation);
          return (
            <div
              key={participation.id}
              className="p-3 bg-surface rounded-xl flex items-center gap-3"
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm",
                result.className
              )}>
                {result.text}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">
                    {participation.match.home_team_score} - {participation.match.away_team_score}
                  </span>
                  {participation.is_mvp && (
                    <Trophy className="w-3.5 h-3.5 text-gold" />
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{formatDate(participation.match.match_date)}</span>
                  {participation.match.location && (
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3" />
                      {participation.match.location}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {(participation.goals || 0) > 0 && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-lg">
                    <Target className="w-3 h-3" />
                    {participation.goals}
                  </span>
                )}
                {(participation.assists || 0) > 0 && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-info/10 text-info rounded-lg">
                    <Medal className="w-3 h-3" />
                    {participation.assists}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
