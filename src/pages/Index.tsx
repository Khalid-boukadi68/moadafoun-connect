import { Link } from 'react-router-dom';
import { MessageCircle, Shield, Users, Heart, Eye, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import logo from '@/assets/unsaid-logo.png';

const features = [
  {
    icon: Shield,
    title: 'Complete Anonymity',
    description: 'Share your deepest thoughts without revealing your identity',
  },
  {
    icon: MessageCircle,
    title: 'Free Expression',
    description: 'Speak your mind openly in a judgment-free space',
  },
  {
    icon: Lock,
    title: 'Privacy First',
    description: 'Your secrets are safe with end-to-end protection',
  },
  {
    icon: Heart,
    title: 'Supportive Community',
    description: 'Connect with others who understand and relate',
  },
];

export default function Index() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-dark py-16 md:py-24">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-primary blur-3xl animate-float" />
          <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-accent blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        </div>
        
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <img 
              src={logo} 
              alt="UNSAID" 
              className="mx-auto mb-8 h-24 w-auto animate-fade-in md:h-32" 
            />
            <h1 className="mb-6 text-3xl font-bold text-white animate-slide-up md:text-5xl">
              Speak Freely.<br />
              <span className="text-gradient-unsaid">Stay Anonymous.</span>
            </h1>
            <p className="mb-8 text-lg text-white/80 animate-slide-up md:text-xl">
              Share your unspoken thoughts, confessions, and feelings without revealing who you are. 
              No judgment. Just understanding.
            </p>
            <div className="flex flex-wrap justify-center gap-4 animate-slide-up">
              {user ? (
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-gradient-unsaid text-white hover:opacity-90"
                >
                  <Link to="/feed">Start Sharing</Link>
                </Button>
              ) : (
                <>
                  <Button 
                    asChild 
                    size="lg" 
                    className="bg-gradient-unsaid text-white hover:opacity-90"
                  >
                    <Link to="/register">Join Anonymously</Link>
                  </Button>
                  <Button 
                    asChild 
                    size="lg" 
                    variant="outline" 
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <Link to="/login">Sign In</Link>
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
          <h2 className="mb-4 text-center text-2xl font-bold md:text-3xl">
            Why <span className="text-gradient-unsaid">UNSAID</span>?
          </h2>
          <p className="mx-auto mb-12 max-w-xl text-center text-muted-foreground">
            A safe space for everything you've always wanted to say but couldn't
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="animate-slide-up border-none shadow-card hover:shadow-unsaid transition-shadow"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-unsaid text-white">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="border-t border-border bg-muted/50 py-16">
        <div className="container">
          <h2 className="mb-12 text-center text-2xl font-bold md:text-3xl">
            How It Works
          </h2>
          <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                1
              </div>
              <h3 className="mb-2 font-semibold">Create Your Alias</h3>
              <p className="text-sm text-muted-foreground">
                Pick a unique username that protects your real identity
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                2
              </div>
              <h3 className="mb-2 font-semibold">Share Anonymously</h3>
              <p className="text-sm text-muted-foreground">
                Post your thoughts with an extra layer of anonymity
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                3
              </div>
              <h3 className="mb-2 font-semibold">Connect & Support</h3>
              <p className="text-sm text-muted-foreground">
                Engage with others who relate to your experiences
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container text-center">
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">
            Ready to speak your mind?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
            Join thousands of people sharing their unspoken thoughts every day
          </p>
          {!user && (
            <Button asChild size="lg" className="bg-gradient-unsaid">
              <Link to="/register">Get Started Free</Link>
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container text-center">
          <img src={logo} alt="UNSAID" className="mx-auto mb-4 h-10 w-auto" />
          <p className="text-sm text-muted-foreground">
            © 2026 UNSAID - Your thoughts, your privacy, your space.
          </p>
        </div>
      </footer>
    </div>
  );
}
