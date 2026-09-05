import { useEffect, useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  FolderOpen,
  Clock3,
} from "lucide-react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";

import { nbaCriteria } from "@/data/nbaCriteria";
import { nbaRequirements } from "@/data/nbaRequirements";
import { departments } from "@/utils/departments";
import { getDocuments } from "@/services/document.service";

export default function NbaCriteriaModule() {
  const navigate = useNavigate();
  const { department } = useParams();

  const [documentCounts, setDocumentCounts] =
    useState<Record<number, number>>({});

  const [evidenceCounts, setEvidenceCounts] =
    useState<Record<number, number>>({});

  const departmentName = department
    ? departments[
        department as keyof typeof departments
      ]?.name
    : undefined;

  useEffect(() => {
    if (!department) {
      setDocumentCounts({});
      setEvidenceCounts({});
      return;
    }

    loadDocumentCounts();
  }, [department]);

  async function loadDocumentCounts() {
    if (!department) return;

    const { data, error } = await getDocuments(
      department
    );

    if (error) {
      console.error(
        "Failed to load NBA documents:",
        error
      );
      return;
    }

    const counts: Record<number, number> = {};
    const completedEvidence: Record<
      number,
      Set<string>
    > = {};

    nbaCriteria.forEach((criterion) => {
      counts[criterion.id] = 0;
      completedEvidence[criterion.id] = new Set();
    });

    data?.forEach((document) => {
      if (document.criterion !== null) {
        counts[document.criterion] =
          (counts[document.criterion] ?? 0) + 1;

        if (document.evidence_requirement) {
          completedEvidence[
            document.criterion
          ]?.add(document.evidence_requirement);
        }
      }
    });

    const evidenceCountResult: Record<
      number,
      number
    > = {};

    nbaCriteria.forEach((criterion) => {
      evidenceCountResult[criterion.id] =
        completedEvidence[criterion.id]?.size ?? 0;
    });

    setDocumentCounts(counts);
    setEvidenceCounts(evidenceCountResult);
  }

  function handleDepartmentChange(
    e: React.ChangeEvent<HTMLSelectElement>
  ) {
    const value = e.target.value;

    if (!value) {
      navigate("/nba");
      return;
    }

    navigate(`/nba/${value}`);
  }

  const totalDocuments = Object.values(
    documentCounts
  ).reduce((sum, count) => sum + count, 0);

  const totalRequired = nbaCriteria.reduce(
    (sum, criterion) =>
      sum +
      (nbaRequirements[criterion.id]?.reduce(
        (subcategoryTotal, subcategory) =>
          subcategoryTotal +
          subcategory.requirements.length,
        0
      ) ?? 0),
    0
  );

  const totalCompletedEvidence = Object.values(
    evidenceCounts
  ).reduce((sum, count) => sum + count, 0);

  const overallPercentage =
    totalRequired === 0
      ? 0
      : Math.min(
          Math.round(
            (totalCompletedEvidence /
              totalRequired) *
              100
          ),
          100
        );

  const completedCriteria = nbaCriteria.filter(
    (criterion) => {
      const required =
        nbaRequirements[criterion.id]?.reduce(
          (total, subcategory) =>
            total +
            subcategory.requirements.length,
          0
        ) ?? 0;

      const completed =
        evidenceCounts[criterion.id] ?? 0;

      return (
        required > 0 &&
        completed >= required
      );
    }
  ).length;

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold">
          NBA Accreditation Repository
        </h1>

        <p className="mt-2 text-muted-foreground">
          Browse documents according to the official NBA
          SAR criteria.
        </p>
      </div>

      {/* Department Selector */}

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">
          Department
        </label>

        <select
          value={department ?? ""}
          onChange={handleDepartmentChange}
          className="h-10 rounded-lg border bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">
            Select Department
          </option>

          {Object.values(departments).map(
            (dept) => (
              <option
                key={dept.slug}
                value={dept.slug}
              >
                {dept.shortName} — {dept.name}
              </option>
            )
          )}
        </select>
      </div>

      {/* No Department */}

      {!department ? (
        <Card className="flex min-h-[250px] items-center justify-center rounded-2xl border">
          <div className="text-center">
            <FolderOpen
              size={40}
              className="mx-auto mb-4 text-muted-foreground"
            />

            <h2 className="text-lg font-semibold">
              Select a Department
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Select a department above to view its NBA
              criteria.
            </p>
          </div>
        </Card>
      ) : (
        <>
          {/* Overview */}

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="rounded-2xl p-5">
              <p className="text-sm text-muted-foreground">
                Total Documents
              </p>

              <p className="mt-2 text-3xl font-bold">
                {totalDocuments}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Uploaded for this department
              </p>
            </Card>

            <Card className="rounded-2xl p-5">
              <p className="text-sm text-muted-foreground">
                Required Evidence
              </p>

              <p className="mt-2 text-3xl font-bold">
                {totalCompletedEvidence}/{totalRequired}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Evidence requirements completed
              </p>
            </Card>

            <Card className="rounded-2xl p-5">
              <p className="text-sm text-muted-foreground">
                Overall Progress
              </p>

              <p className="mt-2 text-3xl font-bold">
                {overallPercentage}%
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {completedCriteria} /{" "}
                {nbaCriteria.length} criteria completed
              </p>
            </Card>
          </div>

          {/* Overall Progress */}

          <Card className="rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">
                  Accreditation Progress
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {departmentName}
                </p>
              </div>

              <span className="font-semibold">
                {overallPercentage}%
              </span>
            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{
                  width: `${overallPercentage}%`,
                }}
              />
            </div>
          </Card>

          {/* Criteria */}

          <div className="space-y-5">
            {nbaCriteria.map((criterion) => {
              const documentCount =
                documentCounts[criterion.id] ?? 0;

              const completedEvidence =
                evidenceCounts[criterion.id] ?? 0;

              const requiredEvidence =
                nbaRequirements[
                  criterion.id
                ]?.reduce(
                  (total, subcategory) =>
                    total +
                    subcategory.requirements.length,
                  0
                ) ?? 0;

              const percentage =
                requiredEvidence === 0
                  ? 0
                  : Math.min(
                      Math.round(
                        (completedEvidence /
                          requiredEvidence) *
                          100
                      ),
                      100
                    );

              const isComplete =
                requiredEvidence > 0 &&
                completedEvidence >=
                  requiredEvidence;

              const isStarted =
                completedEvidence > 0;

              return (
                <Card
                  key={criterion.id}
                  className="rounded-2xl border p-6 transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex gap-4">
                      <div className="rounded-xl bg-slate-100 p-3">
                        <FolderOpen size={22} />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <h2 className="text-xl font-semibold">
                            Criterion {criterion.id}
                          </h2>

                          {isComplete ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                              <CheckCircle2 size={14} />
                              Complete
                            </span>
                          ) : isStarted ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                              <Clock3 size={14} />
                              In Progress
                            </span>
                          ) : (
                            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                              Not Started
                            </span>
                          )}
                        </div>

                        <p className="mt-1 font-medium text-muted-foreground">
                          {criterion.title}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {criterion.subcategories.map(
                            (subcategory) => (
                              <span
                                key={subcategory.id}
                                className="rounded-full bg-slate-100 px-3 py-1 text-sm"
                              >
                                {subcategory.title}
                              </span>
                            )
                          )}
                        </div>

                        <div className="mt-5 w-full max-w-xl">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Evidence Progress
                            </span>

                            <span className="font-medium">
                              {completedEvidence} /{" "}
                              {requiredEvidence}
                            </span>
                          </div>

                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{
                                width: `${percentage}%`,
                              }}
                            />
                          </div>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {percentage}% complete ·{" "}
                            {documentCount} document
                            {documentCount === 1
                              ? ""
                              : "s"} uploaded
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() =>
                        navigate(
                          `/nba/${department}/criterion/${criterion.id}`
                        )
                      }
                    >
                      Open
                      <ChevronRight
                        size={18}
                        className="ml-2"
                      />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}