import { Card } from "@workspace/ui/components/card";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DepartmentCardProps {
  name: string;
  shortName: string;
  icon: React.ReactNode;
  color: string;
  documents: number;
  achievements: number;
  activities: number;
}

export default function DepartmentCard({
  name,
  shortName,
  icon,
  color,
  documents,
  achievements,
  activities,
}: DepartmentCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() =>
        navigate(`/department/${shortName.toLowerCase()}`)
      }
      className="group cursor-pointer overflow-hidden rounded-3xl border-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div
        className="h-2"
        style={{ backgroundColor: color }}
      />

      <div className="p-6">
        <div className="mb-5 flex items-center gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
            style={{
              backgroundColor: `${color}20`,
              color: color,
            }}
          >
            {icon}
          </div>

          <div>
            <h2 className="text-xl font-bold">
              {shortName}
            </h2>

            <p className="text-muted-foreground">
              {name}
            </p>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">
              {documents}
            </p>

            <p className="text-xs text-muted-foreground">
              Documents
            </p>
          </div>

          <div>
            <p className="text-2xl font-bold">
              {achievements}
            </p>

            <p className="text-xs text-muted-foreground">
              Achievements
            </p>
          </div>

          <div>
            <p className="text-2xl font-bold">
              {activities}
            </p>

            <p className="text-xs text-muted-foreground">
              Activities
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end font-medium text-primary">
          View Department

          <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Card>
  );
}