import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { TOPICS } from '@/lib/constants';

interface TopicFilterProps {
  selected: string | null;
  onChange: (topic: string | null) => void;
}

export function TopicFilter({ selected, onChange }: TopicFilterProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap pb-2">
      <div className="flex gap-2">
        <Button
          variant={selected === null ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(null)}
          className={selected === null ? "bg-gradient-unsaid" : ""}
        >
          All
        </Button>
        {TOPICS.map((topic) => (
          <Button
            key={topic.value}
            variant={selected === topic.value ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(topic.value)}
            className={selected === topic.value ? "bg-gradient-unsaid" : ""}
          >
            <span className="mr-1">{topic.icon}</span>
            {topic.label}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

// Alias for compatibility
export { TopicFilter as SectorFilter };
