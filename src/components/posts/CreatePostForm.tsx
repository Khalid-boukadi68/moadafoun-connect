import { useState } from 'react';
import { Loader2, Send, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TOPICS } from '@/lib/constants';
import type { Database } from '@/integrations/supabase/types';

type JobSector = Database['public']['Enums']['job_sector'];

interface CreatePostFormProps {
  onSuccess: () => void;
}

export function CreatePostForm({ onSuccess }: CreatePostFormProps) {
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState<JobSector | ''>('');
  const [isAnonymous, setIsAnonymous] = useState(true); // Default to anonymous
  const [loading, setLoading] = useState(false);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !content.trim() || !topic) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content: content.trim(),
          sector: topic,
          is_anonymous: isAnonymous,
        });

      if (error) throw error;

      setContent('');
      setTopic('');
      setIsAnonymous(true);
      onSuccess();
      toast({
        title: 'Posted!',
        description: isAnonymous ? 'Your anonymous post is now live.' : 'Your post is now live.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create post',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Card className="shadow-card">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-unsaid text-white font-semibold">
              {isAnonymous ? '?' : (profile?.nickname?.charAt(0)?.toUpperCase() || '?')}
            </div>
            <Textarea
              placeholder="What's on your mind? Share it anonymously..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <Select value={topic} onValueChange={(value) => setTopic(value as JobSector)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select topic" />
                </SelectTrigger>
                <SelectContent>
                  {TOPICS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      <span className="flex items-center gap-2">
                        <span>{t.icon}</span>
                        <span>{t.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Switch
                  id="anonymous"
                  checked={isAnonymous}
                  onCheckedChange={setIsAnonymous}
                />
                <Label htmlFor="anonymous" className="flex items-center gap-1 text-sm">
                  <Shield className="h-3.5 w-3.5" />
                  Anonymous
                </Label>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading || !content.trim() || !topic}
              className="bg-gradient-unsaid"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Post
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
