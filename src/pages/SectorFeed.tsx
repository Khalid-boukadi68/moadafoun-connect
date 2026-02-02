import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { StoryCard } from '@/components/posts/StoryCard';
import { Button } from '@/components/ui/button';
import { TOPICS } from '@/lib/constants';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type PostRow = Database['public']['Tables']['posts']['Row'];

type Post = PostRow & {
  profiles: { nickname: string } | null;
};

export default function SectorFeed() {
  const { sector } = useParams<{ sector: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [reactions, setReactions] = useState<Map<string, 'like' | 'dislike'>>(new Map());
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const topic = TOPICS.find(t => t.value === sector);

  const fetchPosts = async () => {
    if (!sector) return;
    
    setLoading(true);
    
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('sector', sector as Database['public']['Enums']['job_sector'])
      .order('created_at', { ascending: false });

    if (!error && data) {
      const userIds = [...new Set(data.map(p => p.user_id))];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, nickname')
        .in('id', userIds);
      
      const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);
      
      const postsWithProfiles: Post[] = data.map(post => ({
        ...post,
        profiles: profilesMap.get(post.user_id) || null,
      }));
      
      setPosts(postsWithProfiles);
    }

    if (user) {
      const { data: reactionData } = await supabase
        .from('post_reactions')
        .select('post_id, reaction_type')
        .eq('user_id', user.id);

      if (reactionData) {
        const reactionMap = new Map<string, 'like' | 'dislike'>();
        reactionData.forEach((r) => {
          reactionMap.set(r.post_id, r.reaction_type as 'like' | 'dislike');
        });
        setReactions(reactionMap);
      }
    }

    setLoading(false);
  };

  const handleReact = async (postId: string, type: 'like' | 'dislike') => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to react to posts',
        variant: 'destructive',
      });
      return;
    }

    const currentReaction = reactions.get(postId);
    
    if (currentReaction === type) {
      await supabase
        .from('post_reactions')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);
      
      const newReactions = new Map(reactions);
      newReactions.delete(postId);
      setReactions(newReactions);
    } else {
      await supabase
        .from('post_reactions')
        .upsert({
          post_id: postId,
          user_id: user.id,
          reaction_type: type,
        }, {
          onConflict: 'post_id,user_id'
        });
      
      const newReactions = new Map(reactions);
      newReactions.set(postId, type);
      setReactions(newReactions);
    }
    
    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, [sector, user]);

  return (
    <AppShell>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link to="/sectors">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span>{topic?.icon}</span>
              {topic?.label || sector}
            </h1>
            <p className="text-sm text-muted-foreground">
              {posts.length} {posts.length === 1 ? 'story' : 'stories'}
            </p>
          </div>
        </div>

        {/* Posts */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-lg text-muted-foreground">No stories in this sector yet</p>
            <p className="text-sm text-muted-foreground mt-1">Be the first to share!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <StoryCard
                key={post.id}
                post={post}
                userReaction={reactions.get(post.id)}
                onReact={(type) => handleReact(post.id, type)}
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
