import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClassFilterProps {
  selectedClass: string;
  classes: string[];
  onClassChange: (value: string) => void;
}

export function ClassFilter({ selectedClass, classes, onClassChange }: ClassFilterProps) {
  return (
    <Select value={selectedClass} onValueChange={onClassChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Filter by class" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Classes</SelectItem>
        {classes.map((className) => (
          <SelectItem key={className} value={className}>
            {className}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}