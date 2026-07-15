import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import { Card } from "@workspace/ui/components/card";

import SubcategoryCard from "./SubcategoryCard";
import { nbaCriteria } from "@/data/nbaCriteria";

interface Props {
  department?: string;
}

export default function CriterionAccordion({
  department,
}: Props) {
  const [openCriterion, setOpenCriterion] =
    useState<number | null>(1);

  return (
    <div className="space-y-6">
      {nbaCriteria.map((criterion) => {
        const isOpen =
          openCriterion === criterion.id;

        const uploadedDocuments = 0;

        const progress =
          (uploadedDocuments /
            criterion.requiredDocuments) *
          100;

        return (
          <Card
            key={criterion.id}
            className="overflow-hidden rounded-2xl"
          >
            <button
              onClick={() =>
                setOpenCriterion(
                  isOpen ? null : criterion.id
                )
              }
              className="flex w-full items-center justify-between p-6 text-left transition hover:bg-slate-50"
            >
              <div>
                <h2 className="text-xl font-semibold">
                  Criterion {criterion.id}
                </h2>

                <p className="mt-1 text-muted-foreground">
                  {criterion.title}
                </p>

                <div className="mt-4">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-slate-900 transition-all"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {uploadedDocuments} /{" "}
                    {criterion.requiredDocuments} Documents Uploaded
                  </p>
                </div>
              </div>

              {isOpen ? (
                <ChevronDown />
              ) : (
                <ChevronRight />
              )}
            </button>

            {isOpen && (
              <div className="border-t bg-slate-50 p-6">
                <div className="space-y-4">
                  {criterion.subcategories.map(
                    (subcategory) => (
                      <SubcategoryCard
                        key={subcategory.id}
                        title={subcategory.title}
                        department={department}
                        criterion={criterion.id}
                        subcategory={subcategory.id}
                      />
                    )
                  )}
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}