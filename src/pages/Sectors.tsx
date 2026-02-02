import { Link } from 'react-router-dom';
import { 
  Lightbulb, 
  Heart, 
  Briefcase, 
  Theater, 
  Sparkles, 
  Megaphone, 
  HelpCircle, 
  Flame, 
  Compass, 
  BookOpen, 
  MoreHorizontal,
  ChevronRight
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/card';
import { TOPICS } from '@/lib/constants';

const topicIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  thoughts: Lightbulb,
  confessions: Theater,
  relationships: Heart,
  work: Briefcase,
  dreams: Sparkles,
  opinions: Megaphone,
  questions: HelpCircle,
  venting: Flame,
  advice: Compass,
  stories: BookOpen,
  other: MoreHorizontal,
};

const topicDescriptions: Record<string, string> = {
  thoughts: 'Share your random thoughts and ideas',
  confessions: 'Get it off your chest anonymously',
  relationships: 'Love, friendship, and connections',
  work: 'Career, workplace, and professional life',
  dreams: 'Aspirations, goals, and night visions',
  opinions: 'Hot takes and unpopular opinions',
  questions: 'Ask the community anything',
  venting: 'Let it all out, no judgment',
  advice: 'Seek or give life advice',
  stories: 'Share experiences and tales',
  other: 'Everything else',
};

export default function Sectors() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sectors</h1>
          <p className="text-muted-foreground mt-1">
            Explore stories by topic
          </p>
        </div>

        <div className="space-y-3">
          {TOPICS.map((topic) => {
            const Icon = topicIcons[topic.value] || MoreHorizontal;
            const description = topicDescriptions[topic.value] || 'Explore this topic';
            
            return (
              <Link key={topic.value} to={`/sectors/${topic.value}`}>
                <Card className="p-4 bg-card border-border hover:border-primary/50 transition-all duration-200 rounded-2xl group">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <span>{topic.icon}</span>
                        {topic.label}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {description}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
