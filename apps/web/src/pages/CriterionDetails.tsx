import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";

import SubcategoryCard from "@/components/nba/SubcategoryCard";
import { nbaCriteria } from "@/data/nbaCriteria";
import { nbaRequirements } from "@/data/nbaRequirements";
import { getDocuments } from "@/services/document.service";
import { getDepartmentName } from "@/utils/departments";

export default function CriterionDetails() {
  const navigate = useNavigate();

  const { department, criterionId } = useParams();

  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const criterion = nbaCriteria.find(
    (item) => item.id === Number(criterionId)
  );

  const requirements =
    nbaRequirements[Number(criterionId)] ?? [];

  useEffect(() => {
    loadDocuments();
  }, [department, criterionId]);

  async function loadDocuments() {
    if (!department || !criterionId) return;

    setLoading(true);

    const { data, error } = await getDocuments(
      department,
      Number(criterionId)
    );

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setDocuments(data ?? []);
    setLoading(false);
  }

  const totalRequirements = useMemo(() => {
    return requirements.reduce(
      (total, subcategory) =>
        total + subcategory.requirements.length,
      0
    );
  }, [requirements]);

  const completedRequirements = useMemo(() => {
    return requirements.reduce((total, subcategory) => {
      return (
        total +
        subcategory.requirements.filter((requirement) =>
          documents.some(
            (document) =>
              document.subcategory ===
                subcategory.subcategoryId &&
              document.evidence_requirement ===
                requirement.id
          )
        ).length
      );
    }, 0);
  }, [requirements, documents]);

  const progress =
    totalRequirements > 0
      ? Math.round(
          (completedRequirements / totalRequirements) *
            100
        )
      : 0;

  if (!criterion) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">
          Criterion not found
        </h1>

        <Button
          className="mt-4"
          onClick={() =>
            navigate(`/nba/${department}`)
          }
        >
          Back to NBA
        </Button>
      </div>
    );
  }

  const departmentName = getDepartmentName(department);

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            navigate(`/nba/${department}`)
          }
        >
          <ArrowLeft size={20} />
        </Button>

        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {departmentName ?? department}
          </p>

          <h1 className="mt-1 text-2xl font-bold">
            Criterion {criterion.id}
          </h1>

          <p className="mt-1 text-lg text-muted-foreground">
            {criterion.title}
          </p>
        </div>
      </div>

      {/* Evidence Progress */}

      <Card className="rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Evidence Coverage
            </p>

            <p className="mt-1 text-2xl font-semibold">
              {completedRequirements}/
              {totalRequirements}
            </p>
          </div>

          <div className="text-right">
            <p className="text-2xl font-semibold">
              {progress}%
            </p>

            <p className="text-sm text-muted-foreground">
              Complete
            </p>
          </div>
        </div>

        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </Card>

      {/* Evidence Requirements */}

      <Card className="rounded-xl p-5">
        <div className="mb-5">
          <h2 className="text-lg font-semibold">
            Evidence Requirements
          </h2>

          <p className="text-sm text-muted-foreground">
            Evidence needed for this criterion
          </p>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">
            Loading evidence...
          </p>
        ) : requirements.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No evidence requirements defined yet.
          </p>
        ) : (
          <div className="space-y-6">
            {requirements.map((subcategory) => {
              const subcategoryTitle =
                criterion.subcategories.find(
                  (item) =>
                    item.id ===
                    subcategory.subcategoryId
                )?.title;

              return (
                <div
                  key={subcategory.subcategoryId}
                >
                  <h3 className="mb-3 text-sm font-semibold">
                    {subcategoryTitle}
                  </h3>

                  <div className="space-y-2">
                    {subcategory.requirements.map(
                      (requirement) => {
                        const completed =
                          documents.some(
                            (document) =>
                              document.subcategory ===
                                subcategory.subcategoryId &&
                              document.evidence_requirement ===
                                requirement.id
                          );

                        return (
                          <div
                            key={requirement.id}
                            className="flex items-center gap-3 rounded-lg border p-3"
                          >
                            {completed ? (
                              <CheckCircle2
                                size={18}
                                className="shrink-0"
                              />
                            ) : (
                              <Circle
                                size={18}
                                className="shrink-0 text-muted-foreground"
                              />
                            )}

                            <span
                              className={
                                completed
                                  ? "text-sm"
                                  : "text-sm text-muted-foreground"
                              }
                            >
                              {requirement.title}
                            </span>

                            <span className="ml-auto text-xs text-muted-foreground">
                              {completed
                                ? "Available"
                                : "Missing"}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Documents */}

      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">
            Documents
          </h2>

          <p className="text-sm text-muted-foreground">
            Documents uploaded under this criterion
          </p>
        </div>

        <div className="space-y-4">
          {criterion.subcategories.map(
            (subcategory) => (
              <SubcategoryCard
                key={subcategory.id}
                title={subcategory.title}
                department={department}
                criterion={criterion.id}
                subcategory={subcategory.id}
                onUploadSuccess={loadDocuments}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}