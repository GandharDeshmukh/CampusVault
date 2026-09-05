import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  CalendarDays,
  Clock,
  MapPin,
  Plus,
  Pencil,
  Trash2,
  User,
  CheckCircle2,
  CircleDot,
  PlayCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";

import { supabase } from "@/lib/supabase";
import {
  addActivity,
  deleteActivity,
  getActivities,
  updateActivity,
} from "@/services/activityPlanner.service";

interface Faculty {
  id: string;
  name: string;
  department: string;
  designation: string;
}

interface Activity {
  id: string;
  title: string;
  description: string | null;
  activity_type: string;
  start_date: string;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  venue: string | null;
  department: string | null;
  faculty_id: string | null;
  status: string;
  faculty?: {
    name: string;
    designation: string;
    department: string;
  } | null;
}

const activityTypes = [
  "Academic",
  "Examination",
  "Workshop",
  "Event",
  "Meeting",
  "Accreditation",
  "Other",
];

function getDepartmentDisplayName(department: string) {
  const names: Record<string, string> = {
    ce: "Computer Engineering",
    it: "Information Technology",
    ece: "Electronics and Computer Engineering",
    "e&ce": "Electronics and Computer Engineering",
    entc: "Electronics and Telecommunication Engineering",
    aids: "Artificial Intelligence and Data Science",
  };

  return names[department.toLowerCase()] ?? department;
}

export default function ActivityPlanner() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  const [selectedDepartment, setSelectedDepartment] =
    useState("");

  const [selectedFaculty, setSelectedFaculty] =
    useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingActivityId, setEditingActivityId] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    activity_type: "Academic",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    venue: "",
    status: "planned",
  });

  useEffect(() => {
    loadFaculties();
    loadActivities();
  }, []);

  async function loadFaculties() {
    const { data, error } = await supabase
      .from("faculty")
      .select("id, name, department, designation")
      .order("name");

    if (error) {
      console.error(error);
      toast.error("Failed to load faculty.");
      return;
    }

    setFaculties(data ?? []);
  }

  async function loadActivities(
    department?: string,
    facultyId?: string
  ) {
    setLoading(true);

    const { data, error } = await getActivities(
      department,
      facultyId
    );

    if (error) {
      console.error(error);
      toast.error("Failed to load activities.");
      setLoading(false);
      return;
    }

    setActivities((data ?? []) as Activity[]);
    setLoading(false);
  }

  const departments = Array.from(
    new Set(
      faculties
        .map((faculty) => faculty.department)
        .filter(Boolean)
    )
  );

  const filteredFaculty = selectedDepartment
    ? faculties.filter(
        (faculty) =>
          faculty.department === selectedDepartment
      )
    : faculties;

  const summary = useMemo(() => {
    const total = activities.length;

    const planned = activities.filter(
      (activity) => activity.status === "planned"
    ).length;

    const ongoing = activities.filter(
      (activity) => activity.status === "ongoing"
    ).length;

    const completed = activities.filter(
      (activity) => activity.status === "completed"
    ).length;

    const cancelled = activities.filter(
      (activity) => activity.status === "cancelled"
    ).length;

    const facultyCounts = activities.reduce(
      (acc, activity) => {
        const facultyId =
          activity.faculty_id ?? "unassigned";

        const facultyName =
          activity.faculty?.name ?? "Unassigned";

        const facultyDepartment =
          activity.faculty?.department ??
          activity.department ??
          "";

        if (!acc[facultyId]) {
          acc[facultyId] = {
            name: facultyName,
            department: facultyDepartment,
            count: 0,
          };
        }

        acc[facultyId].count += 1;

        return acc;
      },
      {} as Record<
        string,
        {
          name: string;
          department: string;
          count: number;
        }
      >
    );

    const typeCounts = activities.reduce(
      (acc, activity) => {
        const type =
          activity.activity_type || "Other";

        acc[type] = (acc[type] ?? 0) + 1;

        return acc;
      },
      {} as Record<string, number>
    );

    return {
      total,
      planned,
      ongoing,
      completed,
      cancelled,
      facultyCounts,
      typeCounts,
    };
  }, [activities]);

  function handleDepartmentChange(
    department: string
  ) {
    setSelectedDepartment(department);
    setSelectedFaculty("");
    setShowForm(false);
    setEditingActivityId(null);

    loadActivities(
      department || undefined,
      undefined
    );
  }

  function handleFacultyChange(
    facultyId: string
  ) {
    setSelectedFaculty(facultyId);
    setShowForm(false);
    setEditingActivityId(null);

    loadActivities(
      selectedDepartment || undefined,
      facultyId || undefined
    );
  }

  function handleFormChange(
    field: string,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function resetForm() {
    setForm({
      title: "",
      description: "",
      activity_type: "Academic",
      start_date: "",
      end_date: "",
      start_time: "",
      end_time: "",
      venue: "",
      status: "planned",
    });

    setEditingActivityId(null);
    setShowForm(false);
  }

  function openAddForm() {
    if (!selectedDepartment) {
      toast.warning(
        "Please select a department first."
      );
      return;
    }

    if (!selectedFaculty) {
      toast.warning(
        "Please select a faculty member first."
      );
      return;
    }

    setEditingActivityId(null);

    setForm({
      title: "",
      description: "",
      activity_type: "Academic",
      start_date: "",
      end_date: "",
      start_time: "",
      end_time: "",
      venue: "",
      status: "planned",
    });

    setShowForm(true);
  }

  function openEditForm(activity: Activity) {
    setSelectedDepartment(
      activity.department ?? ""
    );

    setSelectedFaculty(
      activity.faculty_id ?? ""
    );

    setEditingActivityId(activity.id);

    setForm({
      title: activity.title,
      description: activity.description ?? "",
      activity_type: activity.activity_type,
      start_date: activity.start_date,
      end_date: activity.end_date ?? "",
      start_time: activity.start_time ?? "",
      end_time: activity.end_time ?? "",
      venue: activity.venue ?? "",
      status: activity.status,
    });

    setShowForm(true);

    loadActivities(
      activity.department ?? undefined,
      activity.faculty_id ?? undefined
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!selectedDepartment) {
      toast.warning(
        "Please select a department."
      );
      return;
    }

    if (!selectedFaculty) {
      toast.warning(
        "Please select a faculty member."
      );
      return;
    }

    if (!form.title.trim()) {
      toast.warning(
        "Please enter an activity title."
      );
      return;
    }

    if (!form.start_date) {
      toast.warning(
        "Please select a start date."
      );
      return;
    }

    if (
      form.end_date &&
      form.end_date < form.start_date
    ) {
      toast.warning(
        "End date cannot be before start date."
      );
      return;
    }

    if (
      form.start_time &&
      form.end_time &&
      form.start_date === form.end_date &&
      form.end_time < form.start_time
    ) {
      toast.warning(
        "End time cannot be before start time."
      );
      return;
    }

    try {
      setSaving(true);

      const activityData = {
        title: form.title.trim(),

        description:
          form.description.trim() || null,

        activity_type: form.activity_type,

        start_date: form.start_date,

        end_date:
          form.end_date || null,

        start_time:
          form.start_time || null,

        end_time:
          form.end_time || null,

        venue:
          form.venue.trim() || null,

        department: selectedDepartment,

        faculty_id: selectedFaculty,

        status: form.status,

        created_by: null,
      };

      if (editingActivityId) {
        await updateActivity(
          editingActivityId,
          activityData
        );

        toast.success(
          "Activity updated successfully."
        );
      } else {
        await addActivity(activityData);

        toast.success(
          "Activity added successfully."
        );
      }

      resetForm();

      loadActivities(
        selectedDepartment,
        selectedFaculty
      );
    } catch (error) {
      console.error(error);

      toast.error(
        editingActivityId
          ? "Failed to update activity."
          : "Failed to add activity."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Delete this activity?"
    );

    if (!confirmed) return;

    try {
      await deleteActivity(id);

      toast.success("Activity deleted.");

      loadActivities(
        selectedDepartment || undefined,
        selectedFaculty || undefined
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to delete activity."
      );
    }
  }

  function formatDate(date: string) {
    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  const selectedFacultyName =
    faculties.find(
      (faculty) =>
        faculty.id === selectedFaculty
    )?.name;

  return (
    <div className="space-y-6 p-6">

      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Activity Planner
          </h1>

          <p className="text-sm text-muted-foreground">
            Plan and manage faculty activities.
          </p>
        </div>

        <Button onClick={openAddForm}>
          <Plus
            size={16}
            className="mr-2"
          />

          Add Activity
        </Button>

      </div>

      {/* Filters */}

      <Card className="p-5">

        <div className="grid gap-4 md:grid-cols-2">

          <div>

            <label className="mb-2 block text-sm font-medium">
              Department
            </label>

            <select
              value={selectedDepartment}
              onChange={(e) =>
                handleDepartmentChange(
                  e.target.value
                )
              }
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
            >

              <option value="">
                All Departments
              </option>

              {departments.map(
                (department) => (
                  <option
                    key={department}
                    value={department}
                  >
                    {getDepartmentDisplayName(
                      department
                    )}
                  </option>
                )
              )}

            </select>

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Faculty
            </label>

            <select
              value={selectedFaculty}
              onChange={(e) =>
                handleFacultyChange(
                  e.target.value
                )
              }
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
            >

              <option value="">
                {selectedDepartment
                  ? "Select Faculty"
                  : "All Faculty"}
              </option>

              {filteredFaculty.map(
                (faculty) => (
                  <option
                    key={faculty.id}
                    value={faculty.id}
                  >
                    {faculty.name}
                  </option>
                )
              )}

            </select>

          </div>

        </div>

      </Card>

      {/* Summary */}

      {!loading &&
        activities.length > 0 && (
          <div className="space-y-4">

            <div>
              <h2 className="text-lg font-semibold">
                Activity Summary
              </h2>

              <p className="text-sm text-muted-foreground">
                Overview based on the current filters.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <Card className="p-5">

                <div className="flex items-center gap-3">

                  <div className="rounded-lg bg-primary/10 p-2">
                    <CalendarDays
                      size={20}
                      className="text-primary"
                    />
                  </div>

                  <div>

                    <p className="text-sm text-muted-foreground">
                      Total Activities
                    </p>

                    <p className="text-2xl font-bold">
                      {summary.total}
                    </p>

                  </div>

                </div>

              </Card>

              <Card className="p-5">

                <div className="flex items-center gap-3">

                  <div className="rounded-lg bg-muted p-2">
                    <CircleDot size={20} />
                  </div>

                  <div>

                    <p className="text-sm text-muted-foreground">
                      Planned
                    </p>

                    <p className="text-2xl font-bold">
                      {summary.planned}
                    </p>

                  </div>

                </div>

              </Card>

              <Card className="p-5">

                <div className="flex items-center gap-3">

                  <div className="rounded-lg bg-muted p-2">
                    <PlayCircle size={20} />
                  </div>

                  <div>

                    <p className="text-sm text-muted-foreground">
                      Ongoing
                    </p>

                    <p className="text-2xl font-bold">
                      {summary.ongoing}
                    </p>

                  </div>

                </div>

              </Card>

              <Card className="p-5">

                <div className="flex items-center gap-3">

                  <div className="rounded-lg bg-muted p-2">
                    <CheckCircle2 size={20} />
                  </div>

                  <div>

                    <p className="text-sm text-muted-foreground">
                      Completed
                    </p>

                    <p className="text-2xl font-bold">
                      {summary.completed}
                    </p>

                  </div>

                </div>

              </Card>

            </div>

            <div className="grid gap-4 lg:grid-cols-2">

              {/* Faculty Activity Count */}

              <Card className="p-5">

                <h3 className="font-semibold">
                  Faculty Activity Count
                </h3>

                <div className="mt-4 space-y-3">

                  {Object.entries(
                    summary.facultyCounts
                  )
                    .sort(
                      ([, a], [, b]) =>
                        b.count - a.count
                    )
                    .map(
                      ([
                        facultyId,
                        faculty,
                      ]) => (
                        <div
                          key={facultyId}
                          className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2"
                        >

                          <div className="flex items-start gap-2">

                            <User
                              size={15}
                              className="mt-1 shrink-0"
                            />

                            <div>

                              <p className="text-sm font-medium">
                                {faculty.name}
                              </p>

                              <p className="text-xs text-muted-foreground">
                                {getDepartmentDisplayName(
                                  faculty.department
                                )}
                              </p>

                            </div>

                          </div>

                          <span className="font-semibold">
                            {faculty.count}
                          </span>

                        </div>
                      )
                    )}

                </div>

              </Card>

              {/* Activity Type Breakdown */}

              <Card className="p-5">

                <h3 className="font-semibold">
                  Activity Type Breakdown
                </h3>

                <div className="mt-4 space-y-3">

                  {Object.entries(
                    summary.typeCounts
                  )
                    .sort(
                      ([, a], [, b]) =>
                        b - a
                    )
                    .map(
                      ([
                        type,
                        count,
                      ]) => (
                        <div
                          key={type}
                          className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2"
                        >

                          <span className="text-sm">
                            {type}
                          </span>

                          <span className="font-semibold">
                            {count}
                          </span>

                        </div>
                      )
                    )}

                </div>

              </Card>

            </div>

          </div>
        )}

      {/* Selected Faculty */}

      {selectedFaculty &&
        selectedFacultyName && (
          <div className="rounded-xl border bg-muted/30 px-5 py-4">

            <div className="flex items-center gap-3">

              <div className="rounded-lg bg-primary/10 p-2">
                <User
                  size={18}
                  className="text-primary"
                />
              </div>

              <div>

                <p className="text-xs text-muted-foreground">
                  Planning activities for
                </p>

                <p className="font-semibold">
                  {selectedFacultyName}
                </p>

              </div>

            </div>

          </div>
        )}

      {/* Add / Edit Form */}

      {showForm && (
        <Card className="p-6">

          <div className="mb-5">

            <h2 className="text-lg font-semibold">
              {editingActivityId
                ? "Edit Activity"
                : "Add Activity"}
            </h2>

            <p className="text-sm text-muted-foreground">

              {editingActivityId
                ? "Update the activity details below."
                : "Add an activity for "}

              {!editingActivityId &&
                selectedFacultyName && (
                  <span className="font-medium text-foreground">
                    {selectedFacultyName}.
                  </span>
                )}

            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div className="grid gap-4 md:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Activity Title
                </label>

                <input
                  value={form.title}
                  onChange={(e) =>
                    handleFormChange(
                      "title",
                      e.target.value
                    )
                  }
                  placeholder="e.g. Guest Lecture"
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Activity Type
                </label>

                <select
                  value={
                    form.activity_type
                  }
                  onChange={(e) =>
                    handleFormChange(
                      "activity_type",
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                >

                  {activityTypes.map(
                    (type) => (
                      <option
                        key={type}
                        value={type}
                      >
                        {type}
                      </option>
                    )
                  )}

                </select>

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Start Date
                </label>

                <input
                  type="date"
                  value={
                    form.start_date
                  }
                  onChange={(e) =>
                    handleFormChange(
                      "start_date",
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium">
                  End Date
                </label>

                <input
                  type="date"
                  value={form.end_date}
                  onChange={(e) =>
                    handleFormChange(
                      "end_date",
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Start Time
                </label>

                <input
                  type="time"
                  value={
                    form.start_time
                  }
                  onChange={(e) =>
                    handleFormChange(
                      "start_time",
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium">
                  End Time
                </label>

                <input
                  type="time"
                  value={form.end_time}
                  onChange={(e) =>
                    handleFormChange(
                      "end_time",
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Venue
                </label>

                <input
                  value={form.venue}
                  onChange={(e) =>
                    handleFormChange(
                      "venue",
                      e.target.value
                    )
                  }
                  placeholder="e.g. Seminar Hall"
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Status
                </label>

                <select
                  value={form.status}
                  onChange={(e) =>
                    handleFormChange(
                      "status",
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                >

                  <option value="planned">
                    Planned
                  </option>

                  <option value="ongoing">
                    Ongoing
                  </option>

                  <option value="completed">
                    Completed
                  </option>

                  <option value="cancelled">
                    Cancelled
                  </option>

                </select>

              </div>

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Description
              </label>

              <textarea
                value={
                  form.description
                }
                onChange={(e) =>
                  handleFormChange(
                    "description",
                    e.target.value
                  )
                }
                placeholder="Optional description..."
                rows={3}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
              />

            </div>

            <div className="flex justify-end gap-3">

              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingActivityId
                    ? "Update Activity"
                    : "Save Activity"}
              </Button>

            </div>

          </form>

        </Card>
      )}

      {/* Activities */}

      <div>

        <div className="mb-4 flex items-center justify-between">

          <div>

            <h2 className="text-lg font-semibold">
              Planned Activities
            </h2>

            {selectedFacultyName && (
              <p className="text-sm text-muted-foreground">
                Activities assigned to{" "}
                {selectedFacultyName}
              </p>
            )}

          </div>

          <span className="text-sm text-muted-foreground">
            {activities.length}{" "}
            {activities.length === 1
              ? "activity"
              : "activities"}
          </span>

        </div>

        {loading ? (
          <Card className="p-8 text-center text-sm text-muted-foreground">
            Loading activities...
          </Card>
        ) : activities.length === 0 ? (
          <Card className="p-8 text-center">

            <CalendarDays
              size={32}
              className="mx-auto mb-3 text-muted-foreground"
            />

            <p className="font-medium">
              No activities found
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Select a faculty member and add an activity.
            </p>

          </Card>
        ) : (
          <div className="space-y-3">

            {activities.map(
              (activity) => (
                <Card
                  key={activity.id}
                  className="p-5"
                >

                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="font-semibold">
                          {activity.title}
                        </h3>

                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                          {
                            activity.activity_type
                          }
                        </span>

                        <span className="rounded-full bg-muted px-2.5 py-1 text-xs capitalize">
                          {
                            activity.status
                          }
                        </span>

                      </div>

                      {activity.description && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {
                            activity.description
                          }
                        </p>
                      )}

                      <div className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">

                        <div className="flex items-center gap-2">

                          <User size={15} />

                          <span>
                            {activity.faculty
                              ?.name ??
                              "Unassigned"}
                          </span>

                        </div>

                        <div className="flex items-center gap-2">

                          <CalendarDays
                            size={15}
                          />

                          <span>

                            {formatDate(
                              activity.start_date
                            )}

                            {activity.end_date &&
                              ` – ${formatDate(
                                activity.end_date
                              )}`}

                          </span>

                        </div>

                        {(activity.start_time ||
                          activity.end_time) && (
                          <div className="flex items-center gap-2">

                            <Clock size={15} />

                            <span>

                              {
                                activity.start_time
                              }

                              {activity.end_time &&
                                ` – ${activity.end_time}`}

                            </span>

                          </div>
                        )}

                        {activity.venue && (
                          <div className="flex items-center gap-2">

                            <MapPin size={15} />

                            <span>
                              {
                                activity.venue
                              }
                            </span>

                          </div>
                        )}

                      </div>

                    </div>

                    <div className="flex shrink-0 gap-1">

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          openEditForm(
                            activity
                          )
                        }
                        title="Edit activity"
                      >
                        <Pencil
                          size={17}
                        />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleDelete(
                            activity.id
                          )
                        }
                        className="text-destructive hover:text-destructive"
                        title="Delete activity"
                      >
                        <Trash2
                          size={17}
                        />
                      </Button>

                    </div>

                  </div>

                </Card>
              )
            )}

          </div>
        )}

      </div>

    </div>
  );
}