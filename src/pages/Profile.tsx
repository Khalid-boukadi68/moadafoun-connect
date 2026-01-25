import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Briefcase, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import { SECTORS, MOROCCAN_CITIES } from '@/lib/constants';

export default function Profile() {
  const { profile, updateProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [nickname, setNickname] = useState(profile?.nickname || '');
  const [sector, setSector] = useState(profile?.sector || '');
  const [city, setCity] = useState(profile?.city || '');
  const [isPublicSector, setIsPublicSector] = useState(profile?.is_public_sector ?? true);
  const [loading, setLoading] = useState(false);

  if (authLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
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
        city,
        is_public_sector: isPublicSector,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-lg">
        <Card className="shadow-moroccan">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              الملف الشخصي
            </CardTitle>
            <CardDescription>
              قم بتحديث معلوماتك الشخصية
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nickname">الاسم المستعار</Label>
                <Input
                  id="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="اسمك المستعار"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sector">القطاع الوظيفي</Label>
                <Select value={sector} onValueChange={setSector}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="اختر قطاعك" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {SECTORS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        <span className="flex items-center gap-2">
                          <span>{s.icon}</span>
                          <span>{s.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">المدينة</Label>
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="اختر مدينتك" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {MOROCCAN_CITIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <Label htmlFor="public-sector" className="font-medium">
                    القطاع العام
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    هل تعمل في القطاع العام؟
                  </p>
                </div>
                <Switch
                  id="public-sector"
                  checked={isPublicSector}
                  onCheckedChange={setIsPublicSector}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-moroccan"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="ml-2 h-4 w-4" />
                    حفظ التغييرات
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
