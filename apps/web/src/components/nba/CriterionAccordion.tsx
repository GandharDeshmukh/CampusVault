import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Upload,
} from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";

import { useNavigate, useParams } from "react-router-dom";
import { nbaCriteria } from "@/data/nbaCriteria";

export default function CriterionAccordion() {
  const [openCriterion, setOpenCriterion] =
    useState<number | null>(1);
const navigate = useNavigate();
const { department } = useParams();

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

                  <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-200">
  <div
    className="h-full rounded-full bg-slate-900 transition-all"
    style={{ width: `${progress}%` }}
  />
</div>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {uploadedDocuments} /
                    {" "}
                    {criterion.requiredDocuments}
                    {" "}
                    Documents Uploaded
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

                <div className="grid gap-4 md:grid-cols-2">
                                {criterion.subcategories.map(
                  (subcategory) => (
                    <Card
                      key={subcategory.id}
                      className="rounded-xl border bg-white p-4"
                    >
                      <div className="flex items-center justify-between">

                        <div className="flex items-center gap-3">

                          <div className="rounded-lg bg-slate-100 p-3">
                            <FileText
                              size={18}
                            />
                          </div>

                          <div>

                            <h3 className="font-medium">
                              {subcategory.title}
                            </h3>

                            <p className="text-sm text-muted-foreground">
                              0 Documents
                            </p>

                          </div>

                        </div>

                        <div className="flex gap-2">

                        

                          <Button
  size="sm"
  onClick={() =>
    navigate(
      `/department/${department}/documents/criterion/${criterion.id}`
    )
  }
>
  Open
  <ChevronRight
    size={16}
    className="ml-2"
  />
</Button>

                        </div>

                      </div>
                    </Card>
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