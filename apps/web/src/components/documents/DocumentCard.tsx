import { useState } from "react";
import {
  FileText,
  Bot,
  Loader2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import { getDepartmentShortName } from "@/utils/departments";
import StatusBadge from "@/components/common/StatusBadge";
import DocumentActions from "./DocumentActions";

import type { Document } from "@/types/document";

import {
  createNbaEvaluation,
  evaluateNbaDocument,
} from "@/services/nbaEvaluation.service";

import {
  calculateEvidenceScore,
} from "@/services/nbaScoring.service";

interface Props {
  document: Document;
}

interface EvaluationResult {
  ai_score: number;
  confidence: number;
  relevance_score: number;
  completeness_score: number;
  quality_score: number;
  issues: string[];
  recommendations: string[];
  analysis: string;
}

export default function DocumentCard({
  document,
}: Props) {
  const [evaluating, setEvaluating] =
    useState(false);

  const [evaluation, setEvaluation] =
    useState<EvaluationResult | null>(null);

  async function handleEvaluate() {
    if (
      !document.criterion ||
      !document.evidence_requirement
    ) {
      alert(
        "This document is not mapped to an NBA criterion and evidence requirement."
      );

      return;
    }

    try {
      setEvaluating(true);
      setEvaluation(null);

      /*
       * Step 1:
       * Send document to Gemini.
       */

      const result =
        await evaluateNbaDocument(
          document.file_url,
          document.title,
          document.criterion,
          document.evidence_requirement
        );

      /*
       * Step 2:
       * Calculate the current evidence score.
       *
       * This is intentionally kept separate
       * from the final NBA scoring methodology.
       */

      const ruleResult =
        calculateEvidenceScore(
          true,
          result.ai_score
        );

      /*
       * Step 3:
       * Save the evaluation in Supabase.
       */

      await createNbaEvaluation({
        document_id: document.id,

        criterion:
          document.criterion,

        evidence_requirement:
          document.evidence_requirement,

        ai_score:
          result.ai_score,

        rule_score:
          ruleResult.score,

        confidence:
          result.confidence,

        issues:
          result.issues ?? [],

        recommendations:
          result.recommendations ?? [],

        analysis:
          result.analysis ?? null,
      });

      /*
       * Step 4:
       * Display the result.
       */

      setEvaluation(result);

    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to evaluate document."
      );
    } finally {
      setEvaluating(false);
    }
  }

  return (
    <div className="rounded-xl border bg-background p-5 transition-all hover:shadow-md">

      {/* Document Header */}

      <div className="flex items-start justify-between gap-4">

        <div className="flex gap-4">

          <div className="rounded-lg bg-red-100 p-3">
            <FileText className="h-6 w-6 text-red-600" />
          </div>

          <div>

            <h3 className="text-lg font-semibold">
              {document.title}
            </h3>

            <p className="text-sm text-muted-foreground">
              {document.file_name}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">

              <StatusBadge
                value={document.category}
              />

              <StatusBadge
                value={getDepartmentShortName(
                  document.department
                )}
              />

              {document.criterion && (
                <StatusBadge
                  value={`Criterion ${document.criterion}`}
                />
              )}

            </div>

            <p className="mt-3 text-sm text-muted-foreground">

              Uploaded on{" "}

              {new Date(
                document.created_at
              ).toLocaleDateString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              )}

            </p>

          </div>

        </div>

        <DocumentActions
          document={document}
          onDeleted={() =>
            window.location.reload()
          }
        />

      </div>

      {/* AI Evaluation */}

      <div className="mt-5 border-t pt-5">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h4 className="font-semibold">
              NBA AI Evaluation
            </h4>

            <p className="text-sm text-muted-foreground">
              Check this document against its NBA evidence requirement.
            </p>

          </div>

          <button
            type="button"
            onClick={handleEvaluate}
            disabled={
              evaluating ||
              !document.criterion ||
              !document.evidence_requirement
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {evaluating ? (
              <>
                <Loader2
                  className="h-4 w-4 animate-spin"
                />

                Evaluating...
              </>
            ) : (
              <>
                <Bot className="h-4 w-4" />

                Evaluate with AI
              </>
            )}

          </button>

        </div>

        {!document.criterion ||
        !document.evidence_requirement ? (
          <p className="mt-3 text-xs text-amber-600">
            This document needs an NBA criterion and evidence requirement before it can be evaluated.
          </p>
        ) : (
          <div className="mt-3 rounded-lg bg-muted/40 p-3">

            <p className="text-xs text-muted-foreground">
              Evidence Requirement
            </p>

            <p className="mt-1 text-sm font-medium">
              {document.evidence_requirement}
            </p>

          </div>
        )}

      </div>

      {/* Evaluation Result */}

      {evaluation && (
        <div className="mt-5 space-y-4 border-t pt-5">

          <div className="grid gap-3 sm:grid-cols-4">

            <div className="rounded-lg bg-muted/40 p-4">

              <p className="text-xs text-muted-foreground">
                AI Score
              </p>

              <p className="mt-1 text-2xl font-bold">
                {evaluation.ai_score}
                <span className="text-sm font-normal">
                  /100
                </span>
              </p>

            </div>

            <div className="rounded-lg bg-muted/40 p-4">

              <p className="text-xs text-muted-foreground">
                Relevance
              </p>

              <p className="mt-1 text-xl font-semibold">
                {evaluation.relevance_score}
              </p>

            </div>

            <div className="rounded-lg bg-muted/40 p-4">

              <p className="text-xs text-muted-foreground">
                Completeness
              </p>

              <p className="mt-1 text-xl font-semibold">
                {evaluation.completeness_score}
              </p>

            </div>

            <div className="rounded-lg bg-muted/40 p-4">

              <p className="text-xs text-muted-foreground">
                Confidence
              </p>

              <p className="mt-1 text-xl font-semibold">
                {evaluation.confidence}
              </p>

            </div>

          </div>

          {/* Analysis */}

          {evaluation.analysis && (
            <div className="rounded-lg border p-4">

              <h5 className="font-semibold">
                Analysis
              </h5>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {evaluation.analysis}
              </p>

            </div>
          )}

          {/* Issues */}

          {evaluation.issues.length > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4">

              <div className="flex items-center gap-2">

                <AlertTriangle className="h-4 w-4 text-amber-600" />

                <h5 className="font-semibold">
                  Issues Detected
                </h5>

              </div>

              <ul className="mt-3 space-y-2">

                {evaluation.issues.map(
                  (issue, index) => (
                    <li
                      key={index}
                      className="flex gap-2 text-sm"
                    >
                      <span className="mt-1">
                        •
                      </span>

                      <span>
                        {issue}
                      </span>
                    </li>
                  )
                )}

              </ul>

            </div>
          )}

          {/* Recommendations */}

          {evaluation.recommendations.length >
            0 && (
            <div className="rounded-lg border border-green-200 bg-green-50/50 p-4">

              <div className="flex items-center gap-2">

                <CheckCircle2 className="h-4 w-4 text-green-600" />

                <h5 className="font-semibold">
                  Recommendations
                </h5>

              </div>

              <ul className="mt-3 space-y-2">

                {evaluation.recommendations.map(
                  (
                    recommendation,
                    index
                  ) => (
                    <li
                      key={index}
                      className="flex gap-2 text-sm"
                    >
                      <span className="mt-1">
                        •
                      </span>

                      <span>
                        {recommendation}
                      </span>
                    </li>
                  )
                )}

              </ul>

            </div>
          )}

        </div>
      )}

    </div>
  );
}