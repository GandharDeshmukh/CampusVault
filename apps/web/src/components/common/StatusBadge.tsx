import { Badge } from "@workspace/ui/components/badge";

interface Props {
  value: string;
}

const colors: Record<string, string> = {
  CE: "bg-blue-100 text-blue-700",
  IT: "bg-purple-100 text-purple-700",
  ECE: "bg-green-100 text-green-700",
  ENTC: "bg-orange-100 text-orange-700",
  AIDS: "bg-pink-100 text-pink-700",

  PDF: "bg-red-100 text-red-700",
  WORD: "bg-blue-100 text-blue-700",
  EXCEL: "bg-green-100 text-green-700",
  PPT: "bg-orange-100 text-orange-700",

  NBA: "bg-indigo-100 text-indigo-700",
  NAAC: "bg-emerald-100 text-emerald-700",
};

export default function StatusBadge({ value }: Props) {
  const color =
    colors[value.toUpperCase()] ??
    "bg-gray-100 text-gray-700";

  return (
    <Badge
      className={`${color} border-0 font-medium`}
    >
      {value}
    </Badge>
  );
}