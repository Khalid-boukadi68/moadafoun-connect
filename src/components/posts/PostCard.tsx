import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  Flag, 
  Trash2,
  ChevronDown,
  ChevronUp,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { CommentsSection } from './CommentsSection';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TOPICS } from '@/lib/constants';
import type { Database } from '@/integrations/supabase/types';

type PostRow = Database['public']['Tables']['posts']['Row'];

interface Post extends PostRow {
  profiles: { nickname: string } | null;
}

interface PostCardProps {
  post: Post;
  userReaction?: 'like' | 'dislike';
  onUpdate: () => void;
}

export function PostCard({ post, userReaction, onUpdate }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportOpen, setReportOpen] = useState(false);
  const [currentReaction, setCurrentReaction] = useState(userReaction);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [dislikesCount, setDislikesCount] = useState(post.dislikes_count || 0);
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    setCurrentReaction(userReaction);
    setLikesCount(post.likes_count || 0);
    setDislikesCount(post.dislikes_count || 0);
  }, [userReaction, post.likes_count, post.dislikes_count]);

  const authorName = post.is_anonymous ? 'Anonymous' : (post.profiles?.nickname || 'User');
  const topic = TOPICS.find(t => t.value === post.sector);
  const isOwner = user?.id === post.user_id;

  const handleReaction = async (type: 'like' | 'dislike') => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to react to posts',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (currentReaction === type) {
        // Remove reaction
        await supabase
          .from('post_reactions')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', user.id);
        
        setCurrentReaction(undefined);
        if (type === 'like') setLikesCount(prev => prev - 1);
        else setDislikesCount(prev => prev - 1);
      } else {
        // Add or update reaction
        if (currentReaction) {
          await supabase
            .from('post_reactions')
            .update({ reaction_type: type })
            .eq('post_id', post.id)
            .eq('user_id', user.id);
          
          if (currentReaction === 'like') {
            setLikesCount(prev => prev - 1);
            setDislikesCount(prev => prev + 1);
          } else {
            setDislikesCount(prev => prev - 1);
            setLikesCount(prev => prev + 1);
          }
        } else {
          await supabase
            .from('post_reactions')
            .insert({
              post_id: post.id,
              user_id: user.id,
              reaction_type: type,
            });
          
          if (type === 'like') setLikesCount(prev => prev + 1);
          else setDislikesCount(prev => prev + 1);
        }
        setCurrentReaction(type);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update reaction',
        variant: 'destructive',
      });
    }
  };

  const handleReport = async () => {
    if (!user || !reportReason.trim()) return;

    try {
      await supabase
        .from('reports')
        .insert({
          post_id: post.id,
          reporter_id: user.id,
          reason: reportReason.trim(),
        });

      toast({
        title: 'Report submitted',
        description: 'Thank you for helping keep the community safe.',
      });
      setReportOpen(false);
      setReportReason('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit report',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await supabase
        .from('posts')
        .delete()
        .eq('id', post.id);

      toast({
        title: 'Post deleted',
        description: 'The post has been removed.',
      });
      onUpdate();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete post',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="animate-fade-in shadow-card">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-unsaid text-white font-semibold">
            {post.is_anonymous ? '?' : authorName.charAt(0).toUpperCase()}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold">{authorName}</span>
                {topic && (
                  <Badge variant="secondary" className="text-xs">
                    {topic.icon} {topic.label}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </span>
                
                {(isOwner || isAdmin) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
            
            <p className="mt-2 whitespace-pre-wrap">{post.content}</p>
            
            {post.image_url && (
              <img 
                src={post.image_url} 
                alt="Post image" 
                className="mt-3 rounded-lg max-h-80 object-cover"
              />
            )}
            
            <div className="mt-4 flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleReaction('like')}
                className={currentReaction === 'like' ? 'text-success' : ''}
              >
                <ThumbsUp className="mr-1 h-4 w-4" />
                {likesCount > 0 && likesCount}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleReaction('dislike')}
                className={currentReaction === 'dislike' ? 'text-destructive' : ''}
              >
                <ThumbsDown className="mr-1 h-4 w-4" />
                {dislikesCount > 0 && dislikesCount}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle className="mr-1 h-4 w-4" />
                {post.comments_count || 0}
                {showComments ? (
                  <ChevronUp className="ml-1 h-3 w-3" />
                ) : (
                  <ChevronDown className="ml-1 h-3 w-3" />
                )}
              </Button>
              
              {user && !isOwner && (
                <Dialog open={reportOpen} onOpenChange={setReportOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <Flag className="mr-1 h-4 w-4" />
                      Report
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Report Post</DialogTitle>
                      <DialogDescription>
                        Why are you reporting this content?
                      </DialogDescription>
                    </DialogHeader>
                    <Textarea
                      placeholder="Describe the issue..."
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setReportOpen(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleReport}
                        disabled={!reportReason.trim()}
                        className="bg-gradient-unsaid"
                      >
                        Submit Report
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            
            {showComments && (
              <CommentsSection postId={post.id} onUpdate={onUpdate} />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
