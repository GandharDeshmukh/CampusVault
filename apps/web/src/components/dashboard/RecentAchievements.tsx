import { Card } from "@workspace/ui/components/card";
import { Trophy } from "lucide-react";

const achievements = [
  {
    title: "Smart India Hackathon Winner",
    student: "Gandhar Deshmukh",
  },
  {
    title: "IEEE Research Paper",
    student: "Aditi Kulkarni",
  },
  {
    title: "Football Championship",
    student: "Rahul Patil",
  },
  {
    title: "Coding Contest Winner",
    student: "Om Joshi",
  },
];

export default function RecentAchievements() {
  return (
    <Card className="rounded-2xl p-6 shadow-md">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Recent Achievements
        </h2>

        <Trophy className="text-yellow-500" />
      </div>

      <div className="space-y-4">
        {achievements.map((item) => (
          <div
            key={item.title}
            className="rounded-xl bg-slate-50 p-4 transition hover:bg-slate-100"
          >
            <p className="font-medium">
              {item.title}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {item.student}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}