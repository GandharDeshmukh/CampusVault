import { Card } from "@workspace/ui/components/card";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DepartmentCardProps {
  id: string;
  name: string;
  shortName: string;
  icon: React.ReactNode;
  color: string;
  faculty: number;
  documents: number;
  achievements: number;
}

const slugMap: Record<string, string> = {
  CE: "ce",
  IT: "it",
  "E&CE": "ece",
  ENTC: "entc",
  "AI&DS": "aids",
};

export default function DepartmentCard({
  id,
  name,
  shortName,
  icon,
  color,
  faculty,
  documents,
  achievements,
}: DepartmentCardProps) {
  const navigate = useNavigate();

  function handleClick() {
    const slug =
      slugMap[shortName] ??
      shortName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

    navigate(`/department/${slug}`);
  }

  return (
    <Card
      onClick={handleClick}
      className="group cursor-pointer overflow-hidden rounded-2xl border bg-card shadow-sm transition-colors hover:bg-muted/20"
    >
      <div
        className="h-1"
        style={{
          backgroundColor: color,
        }}
      />

      <div className="p-6">
        <div className="flex items-start gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
            style={{
              backgroundColor: `${color}15`,
              color,
            }}
          >
            {icon}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-muted-foreground">
              {shortName}
            </p>

            <h2 className="mt-1 text-lg font-semibold leading-tight">
              {name}
            </h2>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 divide-x rounded-xl border bg-muted/20">
          <div className="px-3 py-4 text-center">
            <p className="text-xl font-semibold">
              {faculty}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Faculty
            </p>
          </div>

          <div className="px-3 py-4 text-center">
            <p className="text-xl font-semibold">
              {documents}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Documents
            </p>
          </div>

          <div className="px-3 py-4 text-center">
            <p className="text-xl font-semibold">
              {achievements}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Achievements
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between text-sm font-medium">
          <span className="text-muted-foreground">
            Department overview
          </span>

          <span className="flex items-center text-primary">
            View
            <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Card>
  );
}