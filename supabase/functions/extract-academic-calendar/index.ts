import "@supabase/functions-js/edge-runtime.d.ts";

const GEMINI_API_KEY =
  Deno.env.get("GEMINI_API_KEY");

const GEMINI_MODEL =
  "gemini-3.7-flash";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const responseSchema = {
  type: "object",

  properties: {
    academic_year: {
      type: "string",
      description:
        "Academic year such as 2026-27.",
    },

    semester: {
      type: "string",
      description:
        "Semester name or number such as Semester I or Semester II.",
    },

    events: {
      type: "array",

      items: {
        type: "object",

        properties: {
          activity: {
            type: "string",
            description:
              "Exact activity description from one calendar row.",
          },

          description: {
            type: "string",
            description:
              "Additional description if clearly present. Use an empty string if none is present.",
          },

          event_type: {
            type: "string",
            enum: [
              "Academic",
              "Examination",
              "Holiday",
              "Meeting",
              "Workshop",
              "Event",
              "Other",
            ],
          },

          start_date: {
            type: "string",
            description:
              "Start date in YYYY-MM-DD format.",
          },

          end_date: {
            type: "string",
            description:
              "End date in YYYY-MM-DD format. Use an empty string for a single-day event.",
          },
        },

        required: [
          "activity",
          "description",
          "event_type",
          "start_date",
          "end_date",
        ],
      },
    },
  },

  required: [
    "academic_year",
    "semester",
    "events",
  ],
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    if (!GEMINI_API_KEY) {
      return Response.json(
        {
          error:
            "GEMINI_API_KEY is not configured.",
        },
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    const body = await req.json();

    const {
      file_name,
      mime_type,
      file_base64,
    } = body;

    if (
      !file_name ||
      !mime_type ||
      !file_base64
    ) {
      return Response.json(
        {
          error:
            "file_name, mime_type and file_base64 are required.",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const supportedMimeTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];

    if (
      !supportedMimeTypes.includes(
        mime_type
      )
    ) {
      return Response.json(
        {
          error:
            "Unsupported file type. Upload a PDF, PNG, JPG or WEBP file.",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const prompt = `
You are extracting structured data from an official college academic calendar.

Read the uploaded document carefully, including all pages.

The document contains a TABLE of academic activities.

Your job is to convert the table into structured calendar events.

VERY IMPORTANT TABLE RULES:

1. Each physical calendar ROW represents exactly ONE event.

2. Do NOT create multiple events from repeated visual cells.

3. If a table cell is merged vertically or horizontally, it still belongs to the same calendar row.

4. If the same activity name appears visually across multiple rows, determine whether those rows actually represent separate calendar entries by checking their dates and surrounding table information.

5. Do NOT duplicate an event merely because the activity text, date, day, or other cell appears more than once visually.

6. Every extracted event must correspond to a distinct calendar row in the source document.

7. Before returning the result, check the entire extracted list for duplicate events.

8. Two events should NOT both be returned if they have:
   - the same activity,
   - the same event type,
   - the same start date,
   - and the same end date.

9. If multiple rows genuinely represent different dates for the same activity, keep them as separate events.

10. Do not invent missing rows.

11. Do not invent activities or dates.

12. Preserve activity descriptions as closely as possible to the document.

DATE RULES:

13. Convert every date to YYYY-MM-DD.

14. For a multi-day activity, use the first date as start_date and the last date as end_date.

15. For a single-day activity, use an empty string for end_date.

16. If a date is unclear, do not guess.

OTHER RULES:

17. Detect the academic year and semester from the document header whenever possible.

18. Classify each event as:
    Academic
    Examination
    Holiday
    Meeting
    Workshop
    Event
    Other

19. Ignore serial numbers because CampusVault generates them.

20. Ignore logos, addresses, page numbers and unrelated headers/footers.

21. Extract events from every page.

22. This is an extraction task, NOT a summarization task.

23. Return only structured data matching the provided schema.

Before returning the final answer, carefully verify that every event represents a unique calendar row and that identical events have not been repeated.
`;

    const geminiResponse =
      await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            "x-goog-api-key":
              GEMINI_API_KEY,
          },

          body: JSON.stringify({
            contents: [
              {
                role: "user",

                parts: [
                  {
                    inlineData: {
                      mimeType:
                        mime_type,
                      data:
                        file_base64,
                    },
                  },

                  {
                    text: prompt,
                  },
                ],
              },
            ],

            generationConfig: {
              responseMimeType:
                "application/json",

              responseSchema:
                responseSchema,
            },
          }),
        }
      );

    if (!geminiResponse.ok) {
      const errorText =
        await geminiResponse.text();

      console.error(
        "Gemini API error:",
        errorText
      );

      return Response.json(
        {
          error:
            "Gemini extraction failed.",
          details:
            errorText,
        },
        {
          status: 502,
          headers: corsHeaders,
        }
      );
    }

    const geminiData =
      await geminiResponse.json();

    const text =
      geminiData?.candidates?.[0]
        ?.content?.parts?.[0]?.text;

    if (!text) {
      return Response.json(
        {
          error:
            "Gemini returned no extracted data.",
        },
        {
          status: 502,
          headers: corsHeaders,
        }
      );
    }

    const extracted =
      JSON.parse(text);

    const rawEvents =
      Array.isArray(extracted.events)
        ? extracted.events
        : [];

    /*
     * Remove exact duplicate events.
     *
     * Two events are considered duplicates when
     * activity, type, start date and end date
     * are identical.
     */
    const uniqueEvents =
      new Map<
        string,
        Record<string, unknown>
      >();

    for (const event of rawEvents) {
      const activity =
        String(
          event.activity ?? ""
        ).trim();

      const eventType =
        String(
          event.event_type ?? "Other"
        ).trim();

      const startDate =
        String(
          event.start_date ?? ""
        ).trim();

      const endDate =
        String(
          event.end_date ?? ""
        ).trim();

      if (!activity || !startDate) {
        continue;
      }

      const duplicateKey =
        [
          activity.toLowerCase(),
          eventType.toLowerCase(),
          startDate,
          endDate,
        ].join("|");

      if (!uniqueEvents.has(duplicateKey)) {
        uniqueEvents.set(
          duplicateKey,
          {
            activity,

            description:
              event.description
                ? String(
                    event.description
                  ).trim()
                : null,

            event_type:
              eventType || "Other",

            start_date:
              startDate,

            end_date:
              endDate || null,

            department: null,

            source_file:
              file_name,
          }
        );
      }
    }

    const events =
      Array.from(
        uniqueEvents.values()
      );

    return Response.json(
      {
        academic_year:
          extracted.academic_year,

        semester:
          extracted.semester,

        events,
      },
      {
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error(
      "Academic calendar extraction error:",
      error
    );

    return Response.json(
      {
        error:
          "Failed to extract academic calendar.",
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
});