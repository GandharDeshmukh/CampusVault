import { useState } from "react";

import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@workspace/ui/components/button";

import { supabase } from "@/lib/supabase";

export interface ExtractedCalendarEvent {
  activity: string;
  description: string | null;
  event_type: string;
  start_date: string;
  end_date: string | null;
  department: string | null;
  source_file: string | null;
}

interface Props {
  onExtracted: (
    academicYear: string,
    semester: string,
    events: ExtractedCalendarEvent[]
  ) => void;
}

export default function UploadAcademicCalendar({
  onExtracted,
}: Props) {
  const [file, setFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  async function handleExtract() {
    if (!file) {
      toast.warning(
        "Please select an academic calendar."
      );
      return;
    }

    try {
      setLoading(true);

      const fileBase64 =
        await fileToBase64(file);

      const { data, error } =
        await supabase.functions.invoke(
          "extract-academic-calendar",
          {
            body: {
              file_name: file.name,
              mime_type: file.type,
              file_base64: fileBase64,
            },
          }
        );

      if (error) {
        console.error(
          "Calendar extraction failed:",
          error
        );

        throw error;
      }

      if (
        !data ||
        !Array.isArray(data.events)
      ) {
        throw new Error(
          "No calendar events were extracted."
        );
      }

      onExtracted(
        data.academic_year ?? "",
        data.semester ?? "",
        data.events
      );

      toast.success(
        `${data.events.length} calendar events extracted.`
      );
    } catch (error) {
      console.error(
        "Academic calendar extraction failed:",
        error
      );

      toast.error(
        "Failed to extract the academic calendar."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border bg-background p-6">

      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2.5">
          <Upload
            size={20}
            className="text-primary"
          />
        </div>

        <div>
          <h2 className="font-semibold">
            Upload Academic Calendar
          </h2>

          <p className="text-sm text-muted-foreground">
            Upload the college calendar and extract
            its events automatically.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">

        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.webp"
          onChange={(e) =>
            setFile(
              e.target.files?.[0] ?? null
            )
          }
          className="block w-full rounded-lg border bg-background px-3 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground"
        />

        <Button
          onClick={handleExtract}
          disabled={!file || loading}
          className="shrink-0"
        >
          {loading ? (
            <>
              <Loader2
                className="mr-2 animate-spin"
                size={16}
              />
              Extracting...
            </>
          ) : (
            <>
              <Upload
                className="mr-2"
                size={16}
              />
              Extract Calendar
            </>
          )}
        </Button>

      </div>

      {file && (
        <p className="mt-3 text-xs text-muted-foreground">
          Selected: {file.name}
        </p>
      )}

    </div>
  );
}

function fileToBase64(
  file: File
): Promise<string> {
  return new Promise(
    (resolve, reject) => {
      const reader =
        new FileReader();

      reader.onload = () => {
        const result =
          reader.result;

        if (
          typeof result !== "string"
        ) {
          reject(
            new Error(
              "Failed to read file."
            )
          );
          return;
        }

        const base64 =
          result.split(",")[1];

        if (!base64) {
          reject(
            new Error(
              "Failed to convert file."
            )
          );
          return;
        }

        resolve(base64);
      };

      reader.onerror = () =>
        reject(
          new Error(
            "Failed to read file."
          )
        );

      reader.readAsDataURL(file);
    }
  );
}