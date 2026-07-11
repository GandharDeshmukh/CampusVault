import { Search } from "lucide-react";
import { Input } from "@workspace/ui/components/input";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function FacultySearch({
  value,
  onChange,
}: Props) {
  return (
    <div className="relative w-full max-w-sm">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        size={18}
      />

      <Input
        placeholder="Search faculty..."
        className="pl-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}