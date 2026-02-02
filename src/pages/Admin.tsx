import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Shield, AlertTriangle, Trash2, CheckCircle, Loader2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TOPICS } from '@/lib/constants';

interface Report {
  id: string;
  reason: string;
  status: string;
  created_at: string;
  posts: {
    id: string;
    content: string;
    sector: string;
    user_id: string;
  } | null;
}

export default function Admin() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Report['posts'] | null>(null);
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, authLoading, navigate]);

  const fetchReports = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reports')
      .select(`
        *,
        posts (id, content, sector, user_id)
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setReports(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchReports();
    }
  }, [isAdmin]);

  const handleUpdateStatus = async (reportId: string, status: string) => {
    try {
      await supabase
        .from('reports')
        .update({ status })
        .eq('id', reportId);

      toast({
        title: 'Updated',
        description: 'Report status has been updated.',
      });
      fetchReports();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update report',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      toast({
        title: 'Deleted',
        description: 'Post has been removed.',
      });
      fetchReports();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete post',
        variant: 'destructive',
      });
    }
  };

  if (authLoading || loading) {
    return (
      <AppShell>
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppShell>
    );
  }

  if (!isAdmin) return null;

  const pendingReports = reports.filter(r => r.status === 'pending');
  const reviewedReports = reports.filter(r => r.status !== 'pending');

  return (
    <AppShell>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          Admin Dashboard
        </h1>
        
        <Card className="bg-card border-border rounded-2xl shadow-card">
          <CardHeader>
            <CardTitle>Reports Management</CardTitle>
            <CardDescription>
              Review and moderate reported content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending">
              <TabsList className="mb-4 w-full bg-muted rounded-xl">
                <TabsTrigger value="pending" className="flex-1 rounded-lg">
                  Pending
                  {pendingReports.length > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {pendingReports.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="reviewed" className="flex-1 rounded-lg">
                  Reviewed
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-4">
                {pendingReports.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    No pending reports
                  </div>
                ) : (
                  pendingReports.map((report) => (
                    <ReportCard
                      key={report.id}
                      report={report}
                      onView={() => setSelectedPost(report.posts)}
                      onResolve={() => handleUpdateStatus(report.id, 'resolved')}
                      onDelete={() => report.posts && handleDeletePost(report.posts.id)}
                    />
                  ))
                )}
              </TabsContent>

              <TabsContent value="reviewed" className="space-y-4">
                {reviewedReports.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    No reviewed reports
                  </div>
                ) : (
                  reviewedReports.map((report) => (
                    <ReportCard
                      key={report.id}
                      report={report}
                      onView={() => setSelectedPost(report.posts)}
                      reviewed
                    />
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
          <DialogContent className="bg-card border-border rounded-2xl max-w-lg">
            <DialogHeader>
              <DialogTitle>Post Content</DialogTitle>
              <DialogDescription>
                Reported post details
              </DialogDescription>
            </DialogHeader>
            {selectedPost && (
              <div className="space-y-4">
                <div className="rounded-xl bg-muted p-4">
                  <p className="whitespace-pre-wrap">{selectedPost.content}</p>
                </div>
                <Badge variant="secondary" className="rounded-full">
                  {TOPICS.find(t => t.value === selectedPost.sector)?.label || selectedPost.sector}
                </Badge>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}

interface ReportCardProps {
  report: Report;
  onView: () => void;
  onResolve?: () => void;
  onDelete?: () => void;
  reviewed?: boolean;
}

function ReportCard({ report, onView, onResolve, onDelete, reviewed }: ReportCardProps) {
  return (
    <Card className="border-border">
      <CardContent className="flex items-start justify-between gap-4 pt-6">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <span className="font-medium">Reason:</span>
          </div>
          <p className="text-muted-foreground">{report.reason}</p>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
          </p>
        </div>
        
        <div className="flex flex-col gap-2">
          <Button variant="outline" size="sm" onClick={onView}>
            <Eye className="mr-1 h-4 w-4" />
            View
          </Button>
          {!reviewed && (
            <>
              <Button variant="outline" size="sm" onClick={onResolve} className="text-success">
                <CheckCircle className="mr-1 h-4 w-4" />
                Resolve
              </Button>
              <Button variant="outline" size="sm" onClick={onDelete} className="text-destructive">
                <Trash2 className="mr-1 h-4 w-4" />
                Delete
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
