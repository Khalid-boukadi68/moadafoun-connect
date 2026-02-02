import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Hash, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/hooks/useAuth';
import { TOPICS } from '@/lib/constants';

export default function Profile() {
  const { profile, updateProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [nickname, setNickname] = useState(profile?.nickname || '');
  const [sector, setSector] = useState(profile?.sector || '');
  const [loading, setLoading] = useState(false);

  if (authLoading) {
    return (
      <AppShell>
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppShell>
    );
  }

  if (!profile) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({
        nickname,
        sector: sector as any,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Profile Settings</h1>
        
        <Card className="bg-card border-border rounded-2xl shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Your Anonymous Profile
            </CardTitle>
            <CardDescription>
              Update your alias and interests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nickname">Alias</Label>
                <Input
                  id="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Your anonymous alias"
                  className="rounded-xl"
                />
                <p className="text-xs text-muted-foreground">
                  This is how others will see you
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sector">Main Interest</Label>
                <Select value={sector} onValueChange={setSector}>
                  <SelectTrigger className="rounded-xl">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Select your main interest" />
                    </div>
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
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-unsaid rounded-xl py-6"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
