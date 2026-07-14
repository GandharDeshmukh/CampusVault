import { ChevronRight, FolderOpen } from "lucide-react";
import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";

import { nbaCriteria } from "@/data/nbaCriteria";

interface Props {
  criterionId: number;
}

export default function CriterionDetails({
  criterionId,
}: Props) {
  const criterion = nbaCriteria.find(
    (item) => item.id === criterionId
  );

  if (!criterion) {
    return (
      <div className="text-center text-muted-foreground">
        Criterion not found.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Criterion {criterion.id}
        </h1>

        <p className="mt-2 text-lg text-muted-foreground">
          {criterion.title}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {criterion.subcategories.map((subcategory) => (
          <Card
            key={subcategory.id}
            className="rounded-2xl border p-5 transition hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-slate-100 p-3">
                  <FolderOpen size={20} />
                </div>

                <div>
                  <h2 className="font-semibold">
                    {subcategory.name}
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    0 Documents
                  </p>
                </div>
              </div>

              <Button
                size="icon"
                variant="ghost"
              >
                <ChevronRight size={18} />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}