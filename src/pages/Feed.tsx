import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { CreatePostForm } from '@/components/posts/CreatePostForm';
import { PostCard } from '@/components/posts/PostCard';
import { SectorFilter } from '@/components/posts/SectorFilter';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type JobSector = Database['public']['Enums']['job_sector'];
type PostRow = Database['public']['Tables']['posts']['Row'];

type Post = PostRow & {
  profiles: { nickname: string } | null;
};

type Reaction = {
  post_id: string;
  reaction_type: string;
};

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [reactions, setReactions] = useState<Map<string, 'like' | 'dislike'>>(new Map());
  const [selectedSector, setSelectedSector] = useState<JobSector | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPosts = async () => {
    setLoading(true);
    
    let query = supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (selectedSector) {
      query = query.eq('sector', selectedSector);
    }

    const { data, error } = await query;

    if (!error && data) {
      // Fetch profiles for posts
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

    // Fetch user reactions if logged in
    if (user) {
      const { data: reactionData } = await supabase
        .from('post_reactions')
        .select('post_id, reaction_type')
        .eq('user_id', user.id);

      if (reactionData) {
        const reactionMap = new Map<string, 'like' | 'dislike'>();
        reactionData.forEach((r: Reaction) => {
          reactionMap.set(r.post_id, r.reaction_type as 'like' | 'dislike');
        });
        setReactions(reactionMap);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedSector, user]);

  return (
    <Layout>
      <div className="mx-auto max-w-2xl space-y-6">
        <CreatePostForm onSuccess={fetchPosts} />
        
        <SectorFilter selected={selectedSector} onChange={(s) => setSelectedSector(s as JobSector | null)} />

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-lg text-muted-foreground">لا توجد منشورات بعد</p>
            <p className="text-sm text-muted-foreground">كن أول من يشارك!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                userReaction={reactions.get(post.id)}
                onUpdate={fetchPosts}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
