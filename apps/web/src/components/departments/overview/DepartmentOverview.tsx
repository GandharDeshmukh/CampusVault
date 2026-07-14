import {
  FileText,
  Trophy,
  GraduationCap,
  Users,
  Upload,
  Plus,
  ArrowRight,
} from "lucide-react";

import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";

const stats = [
  {
    title: "Documents",
    value: "246",
    icon: FileText,
  },
  {
    title: "Achievements",
    value: "72",
    icon: Trophy,
  },
  {
    title: "Faculty",
    value: "38",
    icon: GraduationCap,
  },
  {
    title: "Students",
    value: "480",
    icon: Users,
  },
];

const recentDocuments = [
  "NBA Self Study Report 2025",
  "Faculty List",
  "Laboratory Equipment Register",
  "Academic Calendar",
];

const recentAchievements = [
  "National Hackathon Winner",
  "Research Paper Published",
  "Patent Filed",
  "Smart India Hackathon Finalist",
];

export default function DepartmentOverview() {
  return (
    <div className="space-y-6">

      {/* Stats */}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <Card
              key={item.title}
              className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-muted-foreground">
                    {item.title}
                  </p>

                  <h2 className="mt-2 text-3xl font-bold">
                    {item.value}
                  </h2>

                </div>

                <div className="rounded-xl bg-slate-100 p-3">
                  <Icon
                    className="text-slate-700"
                    size={24}
                  />
                </div>

              </div>
            </Card>
          );
        })}

      </div>
            {/* Quick Actions + Recent Documents */}

      <div className="grid gap-6 lg:grid-cols-3">

        <Card className="rounded-2xl p-6 lg:col-span-1">

          <h2 className="text-lg font-semibold">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Frequently used department operations.
          </p>

          <div className="mt-6 space-y-3">

            <Button className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Upload size={18} />
                Upload Document
              </span>

              <ArrowRight size={16} />
            </Button>

            <Button
              variant="outline"
              className="w-full justify-between"
            >
              <span className="flex items-center gap-2">
                <Plus size={18} />
                Add Achievement
              </span>

              <ArrowRight size={16} />
            </Button>

            <Button
              variant="outline"
              className="w-full justify-between"
            >
              <span className="flex items-center gap-2">
                <GraduationCap size={18} />
                Manage Faculty
              </span>

              <ArrowRight size={16} />
            </Button>

          </div>

        </Card>

        <Card className="rounded-2xl p-6 lg:col-span-2">

          <div className="mb-5 flex items-center justify-between">

            <div>

              <h2 className="text-lg font-semibold">
                Recent Documents
              </h2>

              <p className="text-sm text-muted-foreground">
                Recently uploaded department files.
              </p>

            </div>

            <Button variant="ghost">
              View All
            </Button>

          </div>

          <div className="space-y-3">

            {recentDocuments.map((doc) => (
              <div
                key={doc}
                className="flex items-center justify-between rounded-xl border p-4 transition hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">

                  <div className="rounded-lg bg-slate-100 p-2">
                    <FileText size={18} />
                  </div>

                  <div>

                    <p className="font-medium">
                      {doc}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      PDF Document
                    </p>

                  </div>

                </div>

                <ArrowRight
                  size={18}
                  className="text-muted-foreground"
                />

              </div>
            ))}

          </div>

        </Card>

      </div>
            {/* Bottom Section */}

      <div className="grid gap-6 lg:grid-cols-2">

        <Card className="rounded-2xl p-6">

          <div className="mb-5 flex items-center justify-between">

            <div>

              <h2 className="text-lg font-semibold">
                Recent Achievements
              </h2>

              <p className="text-sm text-muted-foreground">
                Latest accomplishments of the department.
              </p>

            </div>

            <Button variant="ghost">
              View All
            </Button>

          </div>

          <div className="space-y-3">

            {recentAchievements.map((achievement) => (
              <div
                key={achievement}
                className="flex items-center justify-between rounded-xl border p-4 transition hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">

                  <div className="rounded-lg bg-yellow-100 p-2">
                    <Trophy
                      size={18}
                      className="text-yellow-600"
                    />
                  </div>

                  <div>

                    <p className="font-medium">
                      {achievement}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Department Achievement
                    </p>

                  </div>

                </div>

                <ArrowRight
                  size={18}
                  className="text-muted-foreground"
                />

              </div>
            ))}

          </div>

        </Card>

        <Card className="rounded-2xl p-6">

          <h2 className="text-lg font-semibold">
            Department Information
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Overview of the department.
          </p>

          <div className="mt-6 space-y-5">

            <div>
              <p className="text-sm text-muted-foreground">
                Head of Department
              </p>

              <p className="mt-1 font-semibold">
                Dr. ABC XYZ
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Email
              </p>

              <p className="mt-1">
                hod@campusvault.edu
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Contact
              </p>

              <p className="mt-1">
                +91 98765 43210
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Vision
              </p>

              <p className="mt-1 leading-7">
                To provide quality education,
                encourage innovation, and
                develop competent professionals
                capable of addressing real-world
                engineering challenges.
              </p>
            </div>

          </div>

        </Card>

      </div>

    </div>
  );
}