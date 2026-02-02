import { useState, useEffect } from 'react';
import { TrendingUp, Users, MessageSquare, Activity } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TOPICS } from '@/lib/constants';
import { supabase } from '@/integrations/supabase/client';

interface SectorStat {
  sector: string;
  count: number;
  label: string;
  icon: string;
}

export default function Pulse() {
  const [stats, setStats] = useState<SectorStat[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);

      // Get post counts by sector
      const { data: posts } = await supabase
        .from('posts')
        .select('sector');

      if (posts) {
        const sectorCounts = posts.reduce((acc, post) => {
          acc[post.sector] = (acc[post.sector] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const statsData: SectorStat[] = TOPICS.map(topic => ({
          sector: topic.value,
          count: sectorCounts[topic.value] || 0,
          label: topic.label,
          icon: topic.icon,
        })).sort((a, b) => b.count - a.count);

        setStats(statsData);
        setTotalPosts(posts.length);
      }

      // Get user count
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      setTotalUsers(userCount || 0);
      setLoading(false);
    };

    fetchStats();
  }, []);

  const maxCount = Math.max(...stats.map(s => s.count), 1);

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Activity className="h-7 w-7 text-primary" />
            Community Pulse
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time community activity
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-card border-border rounded-2xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalPosts}</p>
                <p className="text-xs text-muted-foreground">Stories</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border rounded-2xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalUsers}</p>
                <p className="text-xs text-muted-foreground">Anonymous Users</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sector Activity */}
        <Card className="bg-card border-border rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Trending Sectors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                    <div className="h-2 bg-muted rounded" />
                  </div>
                ))}
              </div>
            ) : (
              stats.slice(0, 6).map((stat) => (
                <div key={stat.sector} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground flex items-center gap-2">
                      <span>{stat.icon}</span>
                      {stat.label}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {stat.count} {stat.count === 1 ? 'story' : 'stories'}
                    </span>
                  </div>
                  <Progress 
                    value={(stat.count / maxCount) * 100} 
                    className="h-2 bg-muted"
                  />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Community Sentiment - Placeholder for future feature */}
        <Card className="bg-card border-border rounded-2xl overflow-hidden">
          <div className="p-6 bg-gradient-unsaid text-white">
            <h3 className="font-semibold text-lg">Community Polls</h3>
            <p className="text-white/80 text-sm mt-1">
              Anonymous voting on trending topics coming soon
            </p>
          </div>
          <CardContent className="p-4">
            <p className="text-muted-foreground text-sm text-center py-4">
              🗳️ Feature in development
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
