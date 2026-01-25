import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { ThumbsUp, ThumbsDown, MessageCircle, Flag, MoreVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
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
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SECTORS } from '@/lib/constants';
import { CommentsSection } from './CommentsSection';

interface PostCardProps {
  post: {
    id: string;
    content: string;
    image_url: string | null;
    sector: string;
    is_anonymous: boolean;
    likes_count: number;
    dislikes_count: number;
    comments_count: number;
    created_at: string;
    user_id: string;
    profiles?: {
      nickname: string;
    } | null;
  };
  userReaction?: 'like' | 'dislike' | null;
  onUpdate: () => void;
}

export function PostCard({ post, userReaction, onUpdate }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  const sector = SECTORS.find(s => s.value === post.sector);
  const authorName = post.is_anonymous ? 'مجهول' : (post.profiles?.nickname || 'مستخدم');
  const isOwner = user?.id === post.user_id;

  const handleReaction = async (type: 'like' | 'dislike') => {
    if (!user) {
      toast({
        title: 'يرجى تسجيل الدخول',
        description: 'يجب تسجيل الدخول للتفاعل مع المنشورات',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      if (userReaction === type) {
        // Remove reaction
        await supabase
          .from('post_reactions')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', user.id);
      } else if (userReaction) {
        // Update reaction
        await supabase
          .from('post_reactions')
          .update({ reaction_type: type })
          .eq('post_id', post.id)
          .eq('user_id', user.id);
      } else {
        // Add reaction
        await supabase
          .from('post_reactions')
          .insert({
            post_id: post.id,
            user_id: user.id,
            reaction_type: type,
          });
      }
      onUpdate();
    } catch (error) {
      console.error('Reaction error:', error);
    } finally {
      setLoading(false);
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
          reason: reportReason,
        });

      toast({
        title: 'تم الإبلاغ',
        description: 'شكراً لمساعدتنا في الحفاظ على مجتمع آمن',
      });
      setReportReason('');
      setReportDialogOpen(false);
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء الإبلاغ',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!confirm('هل أنت متأكد من حذف هذا المنشور؟')) return;

    try {
      await supabase
        .from('posts')
        .delete()
        .eq('id', post.id);

      toast({
        title: 'تم الحذف',
        description: 'تم حذف المنشور بنجاح',
      });
      onUpdate();
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء الحذف',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="animate-fade-in shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
              {post.is_anonymous ? '؟' : authorName.charAt(0)}
            </div>
            <div>
              <p className="font-medium">{authorName}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ar })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <span>{sector?.icon}</span>
              <span>{sector?.label}</span>
            </Badge>
            {(isOwner || isAdmin) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                    <Trash2 className="ml-2 h-4 w-4" />
                    حذف المنشور
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <p className="whitespace-pre-wrap leading-relaxed">{post.content}</p>
        {post.image_url && (
          <img 
            src={post.image_url} 
            alt="صورة المنشور" 
            className="mt-3 rounded-lg"
          />
        )}
      </CardContent>

      <CardFooter className="flex-col gap-3 pt-0">
        <div className="flex w-full items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleReaction('like')}
              disabled={loading}
              className={userReaction === 'like' ? 'text-success' : ''}
            >
              <ThumbsUp className="ml-1 h-4 w-4" />
              {post.likes_count}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleReaction('dislike')}
              disabled={loading}
              className={userReaction === 'dislike' ? 'text-destructive' : ''}
            >
              <ThumbsDown className="ml-1 h-4 w-4" />
              {post.dislikes_count}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="ml-1 h-4 w-4" />
              {post.comments_count}
            </Button>
          </div>

          <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Flag className="ml-1 h-4 w-4" />
                إبلاغ
              </Button>
            </DialogTrigger>
            <DialogContent dir="rtl">
              <DialogHeader>
                <DialogTitle>الإبلاغ عن منشور</DialogTitle>
                <DialogDescription>
                  اشرح سبب الإبلاغ عن هذا المنشور
                </DialogDescription>
              </DialogHeader>
              <Textarea
                placeholder="سبب الإبلاغ..."
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
              />
              <Button onClick={handleReport} disabled={!reportReason.trim()}>
                إرسال الإبلاغ
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        {showComments && (
          <CommentsSection postId={post.id} onUpdate={onUpdate} />
        )}
      </CardFooter>
    </Card>
  );
}
