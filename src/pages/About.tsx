import { Shield, Eye, Users, Heart, Lock, MessageCircle } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardContent } from '@/components/ui/card';
import logo from '@/assets/unsaid-logo.png';

const features = [
  {
    icon: Eye,
    title: 'Complete Anonymity',
    description: 'Your identity is never revealed. Share freely without fear.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'We don\'t track, sell, or share your personal data.',
  },
  {
    icon: Users,
    title: 'Safe Community',
    description: 'Moderated space for respectful anonymous discussions.',
  },
  {
    icon: Heart,
    title: 'Support Network',
    description: 'Connect with others who understand what you\'re going through.',
  },
  {
    icon: Lock,
    title: 'Secure Platform',
    description: 'End-to-end security measures protect your stories.',
  },
  {
    icon: MessageCircle,
    title: 'Open Expression',
    description: 'Share thoughts, confessions, and questions freely.',
  },
];

export default function About() {
  return (
    <AppShell>
      <div className="space-y-8">
        {/* Hero */}
        <div className="text-center py-8">
          <img src={logo} alt="UNSAID" className="h-16 w-auto mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground">
            Speak Freely
          </h1>
          <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
            A safe space for anonymous expression. Share what's on your mind without revealing who you are.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-3">
          {features.map((feature) => (
            <Card key={feature.title} className="bg-card border-border rounded-2xl">
              <CardContent className="p-4 flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Community Guidelines */}
        <Card className="bg-card border-border rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Community Guidelines
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Be respectful, even when anonymous
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                No harassment, hate speech, or threats
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Don't share others' personal information
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Report content that violates guidelines
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Support each other with kindness
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-6 text-sm text-muted-foreground">
          <p>UNSAID © {new Date().getFullYear()}</p>
          <p className="mt-1">Made with ❤️ for anonymous expression</p>
        </div>
      </div>
    </AppShell>
  );
}
