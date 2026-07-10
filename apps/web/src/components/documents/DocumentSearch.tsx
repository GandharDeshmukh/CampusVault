import { Search } from "lucide-react";

import { Input } from "@workspace/ui/components/input";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function DocumentSearch({
  value,
  onChange,
}: Props) {
  return (
    <div className="relative max-w-md">
      <Search
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
      />

      <Input
        placeholder="Search documents..."
        className="pl-10"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
      />
    </div>
  );
}