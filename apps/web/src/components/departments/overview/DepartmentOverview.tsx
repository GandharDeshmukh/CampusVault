import { useEffect, useState } from "react";
import {
  FileText,
  Trophy,
  GraduationCap,
  CalendarDays,
  Upload,
  Plus,
  ArrowRight,
  Building2,
  Mail,
  User,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";

import { supabase } from "@/lib/supabase";
import {
  departments,
  getDepartmentName,
} from "@/utils/departments";

import { getActivities } from "@/services/activityPlanner.service";

interface Department {
  id: string;
  name: string;
  short_name: string;
  hod: string | null;
  email: string | null;
  description: string | null;
}

interface Faculty {
  id: string;
  name: string;
  department_id: string | null;
  designation: string;
  email: string | null;
  phone: string | null;
}

interface RecentDocument {
  id: string;
  title: string;
  department: string | null;
  created_at: string;
}

interface RecentAchievement {
  id: string;
  title: string;
  student_name: string;
  department: string | null;
  created_at: string;
}

interface Activity {
  id: string;
  title: string;
  activity_type: string;
  start_date: string;
  status: string;
}

interface Stats {
  documents: number;
  achievements: number;
  faculty: number;
  activities: number;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function DepartmentOverview() {
  const navigate = useNavigate();

  const params = useParams<{
    department?: string;
    departmentSlug?: string;
  }>();

  const departmentSlug =
    params.department ??
    params.departmentSlug;

  const [department, setDepartment] =
    useState<Department | null>(null);

  const [faculties, setFaculties] =
    useState<Faculty[]>([]);

  const [documents, setDocuments] =
    useState<RecentDocument[]>([]);

  const [achievements, setAchievements] =
    useState<RecentAchievement[]>([]);

  const [activities, setActivities] =
    useState<Activity[]>([]);

  const [stats, setStats] = useState<Stats>({
    documents: 0,
    achievements: 0,
    faculty: 0,
    activities: 0,
  });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const departmentShortName =
    Object.values(departments).find(
      (item) =>
        item.slug.toLowerCase() ===
        departmentSlug?.toLowerCase()
    )?.shortName;

  useEffect(() => {
    if (!departmentSlug) {
      setError("Department route is missing.");
      setLoading(false);
      return;
    }

    loadDepartment();
  }, [departmentSlug]);

  async function loadDepartment() {
    setLoading(true);
    setError(null);

    if (!departmentShortName) {
      setError("Department not found.");
      setLoading(false);
      return;
    }

    /*
     * 1. Load department itself
     */

    const {
      data: departmentData,
      error: departmentError,
    } = await supabase
      .from("departments")
      .select("*")
      .eq(
        "short_name",
        departmentShortName
      )
      .single();

    if (departmentError || !departmentData) {
      console.error(
        "DEPARTMENT LOAD ERROR:",
        departmentError
      );

      setError(
        departmentError?.message ??
          "Department not found."
      );

      setLoading(false);
      return;
    }

    setDepartment(departmentData);

    /*
     * 2. Load faculty
     */

    const {
      data: facultyData,
      error: facultyError,
    } = await supabase
      .from("faculty")
      .select(
        "id, name, department_id, designation, email, phone"
      )
      .eq(
        "department_id",
        departmentData.id
      )
      .order("name");

    if (facultyError) {
      console.error(
        "FACULTY LOAD ERROR:",
        facultyError
      );
    }

    const loadedFaculty =
      facultyData ?? [];

    setFaculties(loadedFaculty);

    /*
     * 3. Load documents
     */

    const {
      data: documentData,
      error: documentError,
    } = await supabase
      .from("documents")
      .select(
        "id, title, department, created_at"
      )
      .ilike(
        "department",
        departmentShortName
      )
      .order("created_at", {
        ascending: false,
      })
      .limit(5);

    if (documentError) {
      console.error(
        "DOCUMENT LOAD ERROR:",
        documentError
      );
    }

    setDocuments(documentData ?? []);

    /*
     * 4. Load achievements
     */

    const {
      data: achievementData,
      error: achievementError,
    } = await supabase
      .from("achievements")
      .select(
        "id, title, student_name, department, created_at"
      )
      .ilike(
        "department",
        departmentShortName
      )
      .order("created_at", {
        ascending: false,
      })
      .limit(5);

    if (achievementError) {
      console.error(
        "ACHIEVEMENT LOAD ERROR:",
        achievementError
      );
    }

    setAchievements(
      achievementData ?? []
    );

    /*
     * 5. Load activities
     *
     * Use the existing service instead
     * of assuming the table structure.
     */

    const {
      data: activityData,
      error: activityError,
    } = await getActivities(
      departmentShortName
    );

    if (activityError) {
      console.error(
        "ACTIVITY LOAD ERROR:",
        activityError
      );
    }

    const loadedActivities =
      (activityData ?? []) as Activity[];

    setActivities(
      loadedActivities
    );

    /*
     * 6. Counts
     */

    const {
      count: documentCount,
      error: documentCountError,
    } = await supabase
      .from("documents")
      .select("*", {
        count: "exact",
        head: true,
      })
      .ilike(
        "department",
        departmentShortName
      );

    if (documentCountError) {
      console.error(
        "DOCUMENT COUNT ERROR:",
        documentCountError
      );
    }

    const {
      count: achievementCount,
      error: achievementCountError,
    } = await supabase
      .from("achievements")
      .select("*", {
        count: "exact",
        head: true,
      })
      .ilike(
        "department",
        departmentShortName
      );

    if (achievementCountError) {
      console.error(
        "ACHIEVEMENT COUNT ERROR:",
        achievementCountError
      );
    }

    const {
      data: allActivities,
      error: activityCountError,
    } = await getActivities(
      departmentShortName
    );

    if (activityCountError) {
      console.error(
        "ACTIVITY COUNT ERROR:",
        activityCountError
      );
    }

    setStats({
      documents: documentCount ?? 0,
      achievements:
        achievementCount ?? 0,
      faculty:
        loadedFaculty.length,
      activities:
        allActivities?.length ?? 0,
    });

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading department...
        </p>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="space-y-4">
        <Card className="p-8 text-center">
          <Building2 className="mx-auto h-10 w-10 text-muted-foreground" />

          <h2 className="mt-4 text-xl font-semibold">
            Department not found
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {error ??
              "The requested department does not exist."}
          </p>

          <Button
            className="mt-5"
            onClick={() =>
              navigate("/departments")
            }
          >
            Back to Departments
          </Button>
        </Card>
      </div>
    );
  }

  const departmentName =
    getDepartmentName(
      departmentSlug
    ) ?? department.name;

  const hod =
    faculties.find((faculty) =>
      faculty.designation
        ?.toLowerCase()
        .includes("head of department")
    ) ?? null;

  return (
    <div className="space-y-8">
      {/* Header */}


      {/* Stats */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Faculty
              </p>

              <p className="mt-2 text-3xl font-bold">
                {stats.faculty}
              </p>
            </div>

            <div className="rounded-xl bg-primary/10 p-3">
              <GraduationCap
                size={24}
                className="text-primary"
              />
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Documents
              </p>

              <p className="mt-2 text-3xl font-bold">
                {stats.documents}
              </p>
            </div>

            <div className="rounded-xl bg-primary/10 p-3">
              <FileText
                size={24}
                className="text-primary"
              />
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Achievements
              </p>

              <p className="mt-2 text-3xl font-bold">
                {stats.achievements}
              </p>
            </div>

            <div className="rounded-xl bg-primary/10 p-3">
              <Trophy
                size={24}
                className="text-primary"
              />
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Activities
              </p>

              <p className="mt-2 text-3xl font-bold">
                {stats.activities}
              </p>
            </div>

            <div className="rounded-xl bg-primary/10 p-3">
              <CalendarDays
                size={24}
                className="text-primary"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}

      <Card className="rounded-2xl p-6">
        <div>
          <h2 className="text-lg font-semibold">
            Department Operations
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Common actions for managing this
            department.
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Button
            className="justify-between"
            onClick={() =>
              navigate(
                `/department/${departmentSlug}/documents`
              )
            }
          >
            <span className="flex items-center gap-2">
              <Upload size={17} />
              Documents
            </span>

            <ArrowRight size={16} />
          </Button>

          <Button
            variant="outline"
            className="justify-between"
            onClick={() =>
              navigate(
                `/department/${departmentSlug}/achievements`
              )
            }
          >
            <span className="flex items-center gap-2">
              <Plus size={17} />
              Achievements
            </span>

            <ArrowRight size={16} />
          </Button>

          <Button
            variant="outline"
            className="justify-between"
            onClick={() =>
              navigate(
                `/department/${departmentSlug}/faculty`
              )
            }
          >
            <span className="flex items-center gap-2">
              <GraduationCap size={17} />
              Faculty
            </span>

            <ArrowRight size={16} />
          </Button>

          <Button
            variant="outline"
            className="justify-between"
            onClick={() =>
              navigate(
                `/department/${departmentSlug}/analytics`
              )
            }
          >
            <span className="flex items-center gap-2">
              <CalendarDays size={17} />
              Analytics
            </span>

            <ArrowRight size={16} />
          </Button>
        </div>
      </Card>

      {/* Recent Documents + Achievements */}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Recent Documents
              </h2>

              <p className="text-sm text-muted-foreground">
                Latest records from this department.
              </p>
            </div>

            <Button
              variant="ghost"
              onClick={() =>
                navigate(
                  `/department/${departmentSlug}/documents`
                )
              }
            >
              View All
            </Button>
          </div>

          {documents.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center">
              <FileText className="mx-auto h-8 w-8 text-muted-foreground" />

              <p className="mt-3 text-sm font-medium">
                No documents yet
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center rounded-xl border p-4 transition hover:bg-muted/40"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="rounded-lg bg-muted p-2">
                      <FileText size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {document.title}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {formatDate(
                          document.created_at
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="rounded-2xl p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Recent Achievements
              </h2>

              <p className="text-sm text-muted-foreground">
                Latest accomplishments from this
                department.
              </p>
            </div>

            <Button
              variant="ghost"
              onClick={() =>
                navigate(
                  `/department/${departmentSlug}/achievements`
                )
              }
            >
              View All
            </Button>
          </div>

          {achievements.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center">
              <Trophy className="mx-auto h-8 w-8 text-muted-foreground" />

              <p className="mt-3 text-sm font-medium">
                No achievements yet
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {achievements.map(
                (achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center rounded-xl border p-4 transition hover:bg-muted/40"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="rounded-lg bg-muted p-2">
                        <Trophy size={18} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {achievement.title}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {achievement.student_name}
                          {" • "}
                          {formatDate(
                            achievement.created_at
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Department Information + Activities */}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">
              Department Information
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Basic information about the department.
            </p>
          </div>

          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-muted p-2">
                <User size={17} />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Head of Department
                </p>

                <p className="mt-1 font-medium">
                  {hod?.name ??
                    department.hod ??
                    "Not assigned"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-muted p-2">
                <Mail size={17} />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Department Email
                </p>

                <p className="mt-1 font-medium">
                  {department.email ??
                    hod?.email ??
                    "Not provided"}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Description
              </p>

              <p className="mt-2 text-sm leading-6">
                {department.description ??
                  `Information and records for the ${department.name} department.`}
              </p>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Recent Activities
              </h2>

              <p className="text-sm text-muted-foreground">
                Latest activities planned by the department.
              </p>
            </div>

            <Button
              variant="ghost"
              onClick={() =>
                navigate("/activity-planner")
              }
            >
              View Planner
            </Button>
          </div>

          {activities.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center">
              <CalendarDays className="mx-auto h-8 w-8 text-muted-foreground" />

              <p className="mt-3 text-sm font-medium">
                No activities yet
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities
                .slice(0, 5)
                .map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between rounded-xl border p-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {activity.title}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {activity.activity_type}
                        {" • "}
                        {formatDate(
                          activity.start_date
                        )}
                      </p>
                    </div>

                    <span className="ml-4 shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs capitalize">
                      {activity.status}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}