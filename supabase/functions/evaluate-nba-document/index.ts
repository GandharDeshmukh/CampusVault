const GEMINI_MODEL = "gemini-3.7-flash";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods":
    "POST, OPTIONS",
};

interface RequestBody {
  file_url: string;
  document_title: string;
  criterion: number;
  evidence_requirement: string;
}

function uint8ArrayToBase64(
  bytes: Uint8Array
) {
  let binary = "";

  const chunkSize = 0x8000;

  for (
    let i = 0;
    i < bytes.length;
    i += chunkSize
  ) {
    binary += String.fromCharCode(
      ...bytes.subarray(
        i,
        Math.min(
          i + chunkSize,
          bytes.length
        )
      )
    );
  }

  return btoa(binary);
}

function clampScore(value: unknown) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(100, number)
  );
}

function normalizeStringArray(
  value: unknown
) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item) =>
        typeof item === "string"
    )
    .map((item) => item.trim())
    .filter(Boolean);
}

function sleep(
  milliseconds: number
) {
  return new Promise((resolve) =>
    setTimeout(
      resolve,
      milliseconds
    )
  );
}

async function callGemini(
  apiKey: string,
  mimeType: string,
  fileBase64: string,
  prompt: string
) {
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const maxAttempts = 3;

  for (
    let attempt = 1;
    attempt <= maxAttempts;
    attempt++
  ) {
    const response = await fetch(
      url,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
                {
                  inlineData: {
                    mimeType,
                    data: fileBase64,
                  },
                },
              ],
            },
          ],

          generationConfig: {
            temperature: 0.1,

            responseMimeType:
              "application/json",

            responseSchema: {
              type: "OBJECT",

              properties: {
                relevance_score: {
                  type: "NUMBER",
                },

                completeness_score: {
                  type: "NUMBER",
                },

                quality_score: {
                  type: "NUMBER",
                },

                confidence: {
                  type: "NUMBER",
                },

                authenticity_indicators: {
                  type: "ARRAY",
                  items: {
                    type: "STRING",
                  },
                },

                consistency_issues: {
                  type: "ARRAY",
                  items: {
                    type: "STRING",
                  },
                },

                issues: {
                  type: "ARRAY",
                  items: {
                    type: "STRING",
                  },
                },

                recommendations: {
                  type: "ARRAY",
                  items: {
                    type: "STRING",
                  },
                },

                analysis: {
                  type: "STRING",
                },
              },

              required: [
                "relevance_score",
                "completeness_score",
                "quality_score",
                "confidence",
                "authenticity_indicators",
                "consistency_issues",
                "issues",
                "recommendations",
                "analysis",
              ],
            },
          },
        }),
      }
    );

    if (response.ok) {
      return response;
    }

    const errorText =
      await response.text();

    /*
     * 503 usually means temporary
     * Gemini service overload.
     *
     * Retry only temporary server
     * errors instead of retrying every
     * possible API error.
     */

    if (
      response.status === 503 &&
      attempt < maxAttempts
    ) {
      console.log(
        `Gemini returned 503. Retrying attempt ${
          attempt + 1
        }/${maxAttempts}...`
      );

      await sleep(
        attempt * 2000
      );

      continue;
    }

    throw new Error(
      `Gemini API error (${response.status}): ${errorText}`
    );
  }

  throw new Error(
    "Gemini evaluation failed after multiple attempts."
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(
      "ok",
      {
        headers: corsHeaders,
      }
    );
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({
          error:
            "Method not allowed",
        }),
        {
          status: 405,
          headers: {
            ...corsHeaders,
            "Content-Type":
              "application/json",
          },
        }
      );
    }

    const body =
      (await req.json()) as RequestBody;

    const {
      file_url,
      document_title,
      criterion,
      evidence_requirement,
    } = body;

    if (
      !file_url ||
      !document_title ||
      !criterion ||
      !evidence_requirement
    ) {
      return new Response(
        JSON.stringify({
          error:
            "file_url, document_title, criterion and evidence_requirement are required.",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type":
              "application/json",
          },
        }
      );
    }

    const apiKey =
      Deno.env.get(
        "GEMINI_API_KEY"
      );

    if (!apiKey) {
      throw new Error(
        "GEMINI_API_KEY is not configured."
      );
    }

    /*
     * Download the uploaded document.
     */

    const fileResponse =
      await fetch(file_url);

    if (!fileResponse.ok) {
      throw new Error(
        `Unable to download document. HTTP ${fileResponse.status}`
      );
    }

    const contentType =
      fileResponse.headers.get(
        "content-type"
      ) ?? "application/octet-stream";

    const supportedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    let mimeType = contentType;

    if (
      !supportedTypes.includes(
        mimeType
      )
    ) {
      if (
        file_url
          .toLowerCase()
          .endsWith(".pdf")
      ) {
        mimeType =
          "application/pdf";
      } else if (
        file_url
          .toLowerCase()
          .endsWith(".png")
      ) {
        mimeType = "image/png";
      } else if (
        file_url
          .toLowerCase()
          .endsWith(".jpg") ||
        file_url
          .toLowerCase()
          .endsWith(".jpeg")
      ) {
        mimeType = "image/jpeg";
      } else if (
        file_url
          .toLowerCase()
          .endsWith(".webp")
      ) {
        mimeType = "image/webp";
      } else {
        throw new Error(
          "Unsupported document type."
        );
      }
    }

    const fileBytes =
      new Uint8Array(
        await fileResponse.arrayBuffer()
      );

    const fileBase64 =
      uint8ArrayToBase64(
        fileBytes
      );

    /*
     * Evaluation prompt.
     */

    const prompt = `
You are an NBA accreditation evidence evaluator for a college accreditation management system.

Evaluate the uploaded document ONLY in relation to the following NBA evidence requirement.

DOCUMENT:
${document_title}

NBA CRITERION:
Criterion ${criterion}

EVIDENCE REQUIREMENT:
${evidence_requirement}

Your job is NOT to award an official NBA score.

Instead, estimate how well this document satisfies the specified evidence requirement and identify weaknesses that the college should improve before an actual NBA evaluation.

Evaluate the document on:

1. relevance
   - Does the document actually address the specified evidence requirement?

2. completeness
   - Does it contain the expected information?
   - Are important fields, tables, dates, signatures, supporting details or records missing?

3. quality
   - Is the evidence clear, organized, internally consistent and usable for accreditation?

4. authenticity_indicators
   - Look for visible indicators such as official headings, dates, signatures, department information, academic year, references, approvals or institutional details.
   - Do NOT claim that a document is authentic merely because it looks official.

5. consistency
   - Identify obvious contradictions, missing periods, mismatched dates, totals that do not appear consistent, or other visible inconsistencies.

IMPORTANT:
- Do not invent information that is not present.
- Do not assume that missing information exists.
- If the document cannot be properly evaluated, reduce confidence and explain why.
- Do not claim this is an official NBA evaluation.
- Base the evaluation only on visible/documented evidence.
- Give practical recommendations for improvement.
`;

    /*
     * Call Gemini with automatic retry
     * for temporary 503 errors.
     */

    const geminiResponse =
      await callGemini(
        apiKey,
        mimeType,
        fileBase64,
        prompt
      );

    const geminiData =
      await geminiResponse.json();

    const rawText =
      geminiData?.candidates?.[0]
        ?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error(
        "Gemini returned no evaluation."
      );
    }

    let evaluation;

    try {
      evaluation =
        JSON.parse(rawText);
    } catch {
      throw new Error(
        "Gemini returned invalid JSON."
      );
    }

    const relevanceScore =
      clampScore(
        evaluation.relevance_score
      );

    const completenessScore =
      clampScore(
        evaluation.completeness_score
      );

    const qualityScore =
      clampScore(
        evaluation.quality_score
      );

    const confidence =
      clampScore(
        evaluation.confidence
      );

    /*
     * Temporary AI evidence score.
     *
     * The official NBA weighting will NOT
     * be assumed here.
     */

    const aiScore = Number(
      (
        relevanceScore * 0.4 +
        completenessScore * 0.35 +
        qualityScore * 0.25
      ).toFixed(2)
    );

    const issues = [
      ...normalizeStringArray(
        evaluation.issues
      ),
      ...normalizeStringArray(
        evaluation.consistency_issues
      ),
    ];

    const recommendations =
      normalizeStringArray(
        evaluation.recommendations
      );

    return new Response(
      JSON.stringify({
        success: true,

        document_title,

        criterion,

        evidence_requirement,

        ai_score: aiScore,

        relevance_score:
          relevanceScore,

        completeness_score:
          completenessScore,

        quality_score:
          qualityScore,

        confidence,

        authenticity_indicators:
          normalizeStringArray(
            evaluation.authenticity_indicators
          ),

        issues,

        recommendations,

        analysis:
          typeof evaluation.analysis ===
          "string"
            ? evaluation.analysis
            : "",
      }),
      {
        status: 200,

        headers: {
          ...corsHeaders,

          "Content-Type":
            "application/json",
        },
      }
    );
  } catch (error) {
    console.error(error);

    const message =
      error instanceof Error
        ? error.message
        : "Unknown error occurred.";

    const isTemporaryGeminiError =
      message.includes(
        "Gemini API error (503)"
      );

    return new Response(
      JSON.stringify({
        success: false,

        error: isTemporaryGeminiError
          ? "The AI evaluation service is temporarily busy. Please try again in a moment."
          : message,
      }),
      {
        status: 500,

        headers: {
          ...corsHeaders,

          "Content-Type":
            "application/json",
        },
      }
    );
  }
});