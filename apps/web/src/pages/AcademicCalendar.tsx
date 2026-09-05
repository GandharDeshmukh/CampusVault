import { useEffect, useState } from "react";

import {
  CalendarDays,
  Check,
  Pencil,
  Save,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";

import UploadAcademicCalendar, {
  type ExtractedCalendarEvent,
} from "@/components/calendar/UploadAcademicCalendar";

import {
  addAcademicCalendarEvent,
  getAcademicCalendar,
} from "@/services/academicCalendar.service";

import type { AcademicCalendarEvent } from "@/types/academicCalendar";

export default function AcademicCalendar() {
  const [events, setEvents] =
    useState<AcademicCalendarEvent[]>([]);

  const [extractedEvents, setExtractedEvents] =
    useState<ExtractedCalendarEvent[]>([]);

  const [academicYear, setAcademicYear] =
    useState("");

  const [semester, setSemester] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [editingIndex, setEditingIndex] =
    useState<number | null>(null);

  useEffect(() => {
    loadCalendar();
  }, []);

  async function loadCalendar() {
    setLoading(true);

    const { data, error } =
      await getAcademicCalendar();

    if (error) {
      console.error(
        "Failed to load academic calendar:",
        error
      );

      setLoading(false);
      return;
    }

    setEvents(data ?? []);
    setLoading(false);
  }

  function handleExtracted(
    year: string,
    sem: string,
    extracted: ExtractedCalendarEvent[]
  ) {
    setAcademicYear(year);
    setSemester(sem);
    setExtractedEvents(extracted);
    setEditingIndex(null);
  }

  function updateExtractedEvent(
    index: number,
    field: keyof ExtractedCalendarEvent,
    value: string
  ) {
    setExtractedEvents((current) =>
      current.map((event, i) =>
        i === index
          ? {
              ...event,
              [field]: value,
            }
          : event
      )
    );
  }

  async function handleSaveCalendar() {
    if (
      !academicYear ||
      !semester ||
      extractedEvents.length === 0
    ) {
      toast.warning(
        "There are no calendar events to save."
      );
      return;
    }

    try {
      setSaving(true);

      // Validate all extracted events first
      for (
        let index = 0;
        index < extractedEvents.length;
        index++
      ) {
        const event = extractedEvents[index];

        if (!event.activity?.trim()) {
          throw new Error(
            `Row ${index + 1} is missing the activity description.`
          );
        }

        if (!event.start_date) {
          throw new Error(
            `Row ${index + 1} (${event.activity}) is missing the start date.`
          );
        }
      }

      // Normalize academic year
      const normalizedYear =
        academicYear.trim();

      // Normalize semester formatting
      const normalizedSemester =
        semester
          .replace(/\s*-\s*/g, " ")
          .replace(/\s+/g, " ")
          .trim();

      // Save every reviewed event
      for (const event of extractedEvents) {
        await addAcademicCalendarEvent({
          academic_year:
            normalizedYear,

          semester:
            normalizedSemester,

          activity:
            event.activity.trim(),

          description:
            event.description?.trim() ||
            null,

          event_type:
            event.event_type ||
            "Other",

          start_date:
            event.start_date,

          end_date:
            event.end_date ||
            null,

          department:
            event.department ||
            null,

          source_file:
            event.source_file ||
            null,

          created_by:
            null,
        });
      }

      toast.success(
        "Academic calendar saved successfully."
      );

      setExtractedEvents([]);
      setAcademicYear("");
      setSemester("");
      setEditingIndex(null);

      await loadCalendar();
    } catch (error) {
      console.error(
        "Failed to save academic calendar:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save the academic calendar."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex items-center gap-4">

        <div className="rounded-2xl bg-primary/10 p-3">
          <CalendarDays
            className="text-primary"
            size={28}
          />
        </div>

        <div>
          <h1 className="text-4xl font-bold">
            Academic Calendar
          </h1>

          <p className="text-muted-foreground">
            Upload and manage the academic schedule.
          </p>
        </div>

      </div>

      {/* Upload */}

      <UploadAcademicCalendar
        onExtracted={handleExtracted}
      />

      {/* Extracted Preview */}

      {extractedEvents.length > 0 && (
        <Card className="overflow-hidden rounded-2xl">

          <div className="border-b p-6">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <h2 className="text-xl font-semibold">
                  Review Extracted Calendar
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Review and edit the extracted information
                  before saving it to CampusVault.
                </p>
              </div>

              <Button
                onClick={handleSaveCalendar}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Save
                      className="mr-2 animate-pulse"
                      size={16}
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check
                      className="mr-2"
                      size={16}
                    />
                    Confirm & Save
                  </>
                )}
              </Button>

            </div>

            <div className="mt-4 flex flex-wrap gap-3">

              <span className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
                Academic Year:{" "}
                {academicYear || "-"}
              </span>

              <span className="rounded-full bg-muted px-3 py-1.5 text-sm font-medium">
                Semester:{" "}
                {semester || "-"}
              </span>

              <span className="rounded-full bg-muted px-3 py-1.5 text-sm font-medium">
                {extractedEvents.length} events
              </span>

            </div>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>
                <tr className="border-b bg-muted/40">

                  <th className="px-5 py-4 text-left">
                    Sr. No.
                  </th>

                  <th className="px-5 py-4 text-left">
                    Activity Description
                  </th>

                  <th className="px-5 py-4 text-left">
                    Type
                  </th>

                  <th className="px-5 py-4 text-left">
                    Day
                  </th>

                  <th className="px-5 py-4 text-left">
                    Date
                  </th>

                  <th className="px-5 py-4 text-left">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>

                {extractedEvents.map(
                  (event, index) => {
                    const isEditing =
                      editingIndex === index;

                    return (
                      <tr
                        key={`${event.activity}-${index}`}
                        className="border-b last:border-0"
                      >

                        <td className="px-5 py-4">
                          {index + 1}
                        </td>

                        <td className="px-5 py-4">

                          {isEditing ? (
                            <input
                              value={event.activity}
                              onChange={(e) =>
                                updateExtractedEvent(
                                  index,
                                  "activity",
                                  e.target.value
                                )
                              }
                              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                            />
                          ) : (
                            <span className="font-medium">
                              {event.activity}
                            </span>
                          )}

                        </td>

                        <td className="px-5 py-4">

                          {isEditing ? (
                            <select
                              value={
                                event.event_type
                              }
                              onChange={(e) =>
                                updateExtractedEvent(
                                  index,
                                  "event_type",
                                  e.target.value
                                )
                              }
                              className="rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                            >
                              <option>
                                Academic
                              </option>

                              <option>
                                Examination
                              </option>

                              <option>
                                Holiday
                              </option>

                              <option>
                                Meeting
                              </option>

                              <option>
                                Workshop
                              </option>

                              <option>
                                Event
                              </option>

                              <option>
                                Other
                              </option>
                            </select>
                          ) : (
                            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                              {event.event_type}
                            </span>
                          )}

                        </td>

                        <td className="px-5 py-4">
                          {getDayText(event)}
                        </td>

                        <td className="px-5 py-4">

                          {isEditing ? (
                            <div className="flex flex-col gap-2">

                              <input
                                type="date"
                                value={
                                  event.start_date
                                }
                                onChange={(e) =>
                                  updateExtractedEvent(
                                    index,
                                    "start_date",
                                    e.target.value
                                  )
                                }
                                className="rounded-md border bg-background px-3 py-2 text-sm"
                              />

                              <input
                                type="date"
                                value={
                                  event.end_date ||
                                  ""
                                }
                                onChange={(e) =>
                                  updateExtractedEvent(
                                    index,
                                    "end_date",
                                    e.target.value
                                  )
                                }
                                className="rounded-md border bg-background px-3 py-2 text-sm"
                              />

                            </div>
                          ) : (
                            getDateText(event)
                          )}

                        </td>

                        <td className="px-5 py-4">

                          {isEditing ? (
                            <div className="flex gap-2">

                              <Button
                                size="sm"
                                onClick={() =>
                                  setEditingIndex(
                                    null
                                  )
                                }
                              >
                                <Check
                                  size={15}
                                />
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  setEditingIndex(
                                    null
                                  )
                                }
                              >
                                <X
                                  size={15}
                                />
                              </Button>

                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                setEditingIndex(
                                  index
                                )
                              }
                            >
                              <Pencil
                                className="mr-2"
                                size={15}
                              />
                              Edit
                            </Button>
                          )}

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        </Card>
      )}

      {/* Existing Calendar */}

      <Card className="overflow-hidden rounded-2xl">

        <div className="border-b p-6">

          <h2 className="text-xl font-semibold">
            Academic Schedule
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Saved academic events and important dates.
          </p>

        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            Loading academic calendar...
          </div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center">

            <CalendarDays
              className="mx-auto mb-4 text-muted-foreground"
              size={40}
            />

            <h3 className="font-semibold">
              No calendar events
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Upload the college academic calendar to
              get started.
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>
                <tr className="border-b bg-muted/40">

                  <th className="px-6 py-4 text-left">
                    Sr. No.
                  </th>

                  <th className="px-6 py-4 text-left">
                    Activity Description
                  </th>

                  <th className="px-6 py-4 text-left">
                    Day
                  </th>

                  <th className="px-6 py-4 text-left">
                    Date
                  </th>

                </tr>
              </thead>

              <tbody>

                {events.map(
                  (event, index) => (
                    <tr
                      key={event.id}
                      className="border-b last:border-0"
                    >

                      <td className="px-6 py-4">
                        {index + 1}
                      </td>

                      <td className="px-6 py-4 font-medium">
                        {event.activity}
                      </td>

                      <td className="px-6 py-4">
                        {getDayText(event)}
                      </td>

                      <td className="px-6 py-4">
                        {getDateText(event)}
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </Card>

    </div>
  );
}

function getDayText(
  event:
    | AcademicCalendarEvent
    | ExtractedCalendarEvent
) {
  const start = new Date(
    `${event.start_date}T00:00:00`
  );

  const end = event.end_date
    ? new Date(
        `${event.end_date}T00:00:00`
      )
    : null;

  if (
    !end ||
    start.getTime() === end.getTime()
  ) {
    return start.toLocaleDateString(
      "en-IN",
      {
        weekday: "short",
      }
    );
  }

  return `${start.toLocaleDateString(
    "en-IN",
    {
      weekday: "short",
    }
  )} to ${end.toLocaleDateString(
    "en-IN",
    {
      weekday: "short",
    }
  )}`;
}

function getDateText(
  event:
    | AcademicCalendarEvent
    | ExtractedCalendarEvent
) {
  const start = new Date(
    `${event.start_date}T00:00:00`
  );

  if (!event.end_date) {
    return start.toLocaleDateString(
      "en-IN"
    );
  }

  const end = new Date(
    `${event.end_date}T00:00:00`
  );

  return `${start.toLocaleDateString(
    "en-IN"
  )} to ${end.toLocaleDateString(
    "en-IN"
  )}`;
} 