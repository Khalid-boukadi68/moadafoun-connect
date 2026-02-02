import { useState } from 'react';
import { MoreHorizontal, MessageCircle, Check, Minus, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { TOPICS } from '@/lib/constants';
import type { Database } from '@/integrations/supabase/types';

type PostRow = Database['public']['Tables']['posts']['Row'];

type Post = PostRow & {
  profiles: { nickname: string } | null;
};

interface StoryCardProps {
  post: Post;
  userReaction?: 'like' | 'dislike' | null;
  onReact?: (type: 'like' | 'dislike') => void;
  onComment?: () => void;
  onReport?: () => void;
}

export function StoryCard({ post, userReaction, onReact, onComment, onReport }: StoryCardProps) {
  const [showComments, setShowComments] = useState(false);
  
  const topic = TOPICS.find(t => t.value === post.sector);
  const totalReactions = (post.likes_count || 0) + (post.dislikes_count || 0);
  const agreePercent = totalReactions > 0 ? Math.round(((post.likes_count || 0) / totalReactions) * 100) : 0;
  const disagreePercent = totalReactions > 0 ? Math.round(((post.dislikes_count || 0) / totalReactions) * 100) : 0;
  const neutralPercent = 100 - agreePercent - disagreePercent;

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}d`;
  };

  return (
    <Card className="rounded-2xl overflow-hidden bg-card border-border shadow-lg animate-fade-in">
      {/* Post Image */}
      {post.image_url && (
        <div className="relative aspect-video bg-muted">
          <img 
            src={post.image_url} 
            alt="Post image" 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <CardContent className="p-4 space-y-3">
        {/* Header: Topic Badge + Time + Menu */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge 
              variant="secondary" 
              className="rounded-full px-3 py-1 bg-primary/10 text-primary border-0"
            >
              {topic?.icon} {topic?.label || post.sector}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatTimeAgo(post.created_at)}
            </span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
              <DropdownMenuItem onClick={onReport} className="text-destructive">
                Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Post Content */}
        <p className="text-foreground text-base leading-relaxed">
          {post.content}
        </p>

        {/* Author (if not anonymous) */}
        {!post.is_anonymous && post.profiles?.nickname && (
          <p className="text-sm text-muted-foreground">
            — {post.profiles.nickname}
          </p>
        )}

        {/* Reactions Bar */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => onReact?.('like')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all",
              userReaction === 'like'
                ? "bg-agree/20 text-agree"
                : "bg-muted hover:bg-agree/10 text-muted-foreground hover:text-agree"
            )}
          >
            <Check className="h-5 w-5" />
            <span className="text-sm font-medium">{agreePercent}%</span>
          </button>
          
          <button
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all",
              "bg-muted text-muted-foreground"
            )}
          >
            <Minus className="h-5 w-5" />
            <span className="text-sm font-medium">{neutralPercent}%</span>
          </button>
          
          <button
            onClick={() => onReact?.('dislike')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all",
              userReaction === 'dislike'
                ? "bg-disagree/20 text-disagree"
                : "bg-muted hover:bg-disagree/10 text-muted-foreground hover:text-disagree"
            )}
          >
            <X className="h-5 w-5" />
            <span className="text-sm font-medium">{disagreePercent}%</span>
          </button>
        </div>

        {/* Comments Button */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors pt-1"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-sm">{post.comments_count || 0} comments</span>
        </button>
      </CardContent>
    </Card>
  );
}
