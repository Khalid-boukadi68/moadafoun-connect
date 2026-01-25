import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { SECTORS } from '@/lib/constants';

interface SectorFilterProps {
  selected: string | null;
  onChange: (sector: string | null) => void;
}

export function SectorFilter({ selected, onChange }: SectorFilterProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap pb-2">
      <div className="flex gap-2">
        <Button
          variant={selected === null ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(null)}
          className={selected === null ? "bg-gradient-moroccan" : ""}
        >
          الكل
        </Button>
        {SECTORS.map((sector) => (
          <Button
            key={sector.value}
            variant={selected === sector.value ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(sector.value)}
            className={selected === sector.value ? "bg-gradient-moroccan" : ""}
          >
            <span className="ml-1">{sector.icon}</span>
            {sector.label}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
