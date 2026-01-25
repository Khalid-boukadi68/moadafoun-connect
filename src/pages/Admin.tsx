import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
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
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SECTORS } from '@/lib/constants';

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
        title: 'تم التحديث',
        description: 'تم تحديث حالة البلاغ',
      });
      fetchReports();
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء التحديث',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنشور؟')) return;

    try {
      await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      toast({
        title: 'تم الحذف',
        description: 'تم حذف المنشور بنجاح',
      });
      fetchReports();
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء الحذف',
        variant: 'destructive',
      });
    }
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!isAdmin) return null;

  const pendingReports = reports.filter(r => r.status === 'pending');
  const reviewedReports = reports.filter(r => r.status !== 'pending');

  return (
    <Layout>
      <div className="mx-auto max-w-4xl">
        <Card className="shadow-moroccan">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              لوحة الإدارة
            </CardTitle>
            <CardDescription>
              إدارة البلاغات والمنشورات
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending">
              <TabsList className="mb-4 w-full">
                <TabsTrigger value="pending" className="flex-1">
                  قيد المراجعة
                  {pendingReports.length > 0 && (
                    <Badge variant="destructive" className="mr-2">
                      {pendingReports.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="reviewed" className="flex-1">
                  تمت المراجعة
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-4">
                {pendingReports.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    لا توجد بلاغات قيد المراجعة
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
                    لا توجد بلاغات سابقة
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
          <DialogContent dir="rtl" className="max-w-lg">
            <DialogHeader>
              <DialogTitle>محتوى المنشور</DialogTitle>
              <DialogDescription>
                المنشور المُبلغ عنه
              </DialogDescription>
            </DialogHeader>
            {selectedPost && (
              <div className="space-y-4">
                <div className="rounded-lg bg-muted p-4">
                  <p className="whitespace-pre-wrap">{selectedPost.content}</p>
                </div>
                <Badge variant="secondary">
                  {SECTORS.find(s => s.value === selectedPost.sector)?.label || selectedPost.sector}
                </Badge>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
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
            <span className="font-medium">سبب البلاغ:</span>
          </div>
          <p className="text-muted-foreground">{report.reason}</p>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(report.created_at), { addSuffix: true, locale: ar })}
          </p>
        </div>
        
        <div className="flex flex-col gap-2">
          <Button variant="outline" size="sm" onClick={onView}>
            <Eye className="ml-1 h-4 w-4" />
            عرض
          </Button>
          {!reviewed && (
            <>
              <Button variant="outline" size="sm" onClick={onResolve} className="text-success">
                <CheckCircle className="ml-1 h-4 w-4" />
                تم
              </Button>
              <Button variant="outline" size="sm" onClick={onDelete} className="text-destructive">
                <Trash2 className="ml-1 h-4 w-4" />
                حذف
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
