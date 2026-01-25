import { Link } from 'react-router-dom';
import { MessageSquare, Shield, Users, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import logo from '@/assets/logo.png';

const features = [
  {
    icon: MessageSquare,
    title: 'شارك رأيك',
    description: 'ناقش قضايا العمل وشارك تجاربك مع الموظفين الآخرين',
  },
  {
    icon: Shield,
    title: 'خصوصية تامة',
    description: 'اختر النشر بشكل مجهول للحفاظ على خصوصيتك',
  },
  {
    icon: Users,
    title: 'مجتمع متنوع',
    description: 'تواصل مع موظفين من جميع القطاعات المغربية',
  },
  {
    icon: Eye,
    title: 'شفافية ومصداقية',
    description: 'بيئة آمنة للنقاش البناء والمفيد',
  },
];

export default function Index() {
  const { user } = useAuth();

  return (
    <div dir="rtl" className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-moroccan py-16 md:py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-gold blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-moroccan-blue blur-3xl" />
        </div>
        
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <img 
              src={logo} 
              alt="موظفون" 
              className="mx-auto mb-8 h-24 w-auto animate-fade-in md:h-32" 
            />
            <h1 className="mb-6 text-3xl font-bold text-primary-foreground animate-slide-up md:text-5xl">
              منصة الموظفين المغاربة
            </h1>
            <p className="mb-8 text-lg text-primary-foreground/90 animate-slide-up md:text-xl">
              فضاء آمن لمشاركة الآراء، النقاش حول قضايا العمل، وطرح الأسئلة بكل حرية
            </p>
            <div className="flex flex-wrap justify-center gap-4 animate-slide-up">
              {user ? (
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-card text-primary hover:bg-card/90"
                >
                  <Link to="/feed">ابدأ المشاركة</Link>
                </Button>
              ) : (
                <>
                  <Button 
                    asChild 
                    size="lg" 
                    className="bg-card text-primary hover:bg-card/90"
                  >
                    <Link to="/register">انضم إلينا</Link>
                  </Button>
                  <Button 
                    asChild 
                    size="lg" 
                    variant="outline" 
                    className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    <Link to="/login">تسجيل الدخول</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="mb-12 text-center text-2xl font-bold md:text-3xl">
            لماذا موظفون؟
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="animate-slide-up border-none shadow-card"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-muted/50 py-16">
        <div className="container text-center">
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">
            انضم لمجتمع الموظفين
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
            صوتك مهم. شارك تجاربك وآرائك مع الآلاف من الموظفين المغاربة
          </p>
          {!user && (
            <Button asChild size="lg" className="bg-gradient-moroccan">
              <Link to="/register">سجّل الآن مجاناً</Link>
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container text-center">
          <img src={logo} alt="موظفون" className="mx-auto mb-4 h-10 w-auto" />
          <p className="text-sm text-muted-foreground">
            © 2026 موظفون - جميع الحقوق محفوظة
          </p>
        </div>
      </footer>
    </div>
  );
}
