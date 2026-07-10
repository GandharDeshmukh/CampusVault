import {
  Laptop,
  Monitor,
  Radio,
  Brain,
  Cpu,
} from "lucide-react";

import DepartmentCard from "./DepartmentCard";

const departments = [
  {
    name: "Computer Engineering",
    shortName: "CE",
    icon: <Laptop />,
    color: "#2563EB",
    documents: 245,
    achievements: 83,
    activities: 21,
  },
  {
    name: "Information Technology",
    shortName: "IT",
    icon: <Monitor />,
    color: "#7C3AED",
    documents: 198,
    achievements: 72,
    activities: 18,
  },
  {
    name: "Electronics & Telecommunication",
    shortName: "ENTC",
    icon: <Radio />,
    color: "#10B981",
    documents: 165,
    achievements: 61,
    activities: 17,
  },
  {
    name: "Artificial Intelligence & Data Science",
    shortName: "AI&DS",
    icon: <Brain />,
    color: "#F59E0B",
    documents: 142,
    achievements: 54,
    activities: 16,
  },
  {
    name: "Electronics & Computer Engineering",
    shortName: "E&CE",
    icon: <Cpu />,
    color: "#EF4444",
    documents: 153,
    achievements: 58,
    activities: 19,
  },
];

export default function DepartmentGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {departments.map((department) => (
        <DepartmentCard
          key={department.shortName}
          {...department}
        />
      ))}
    </div>
  );
}