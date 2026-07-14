import { ChevronRight, FolderOpen } from "lucide-react";
import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";

import { nbaCriteria } from "@/data/nbaCriteria";

export default function NbaCriteriaModule() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          NBA Accreditation Repository
        </h1>

        <p className="mt-2 text-muted-foreground">
          Browse documents according to the official NBA SAR criteria.
        </p>
      </div>

      <div className="space-y-5">
        {nbaCriteria.map((criterion) => (
          <Card
            key={criterion.id}
            className="rounded-2xl border p-6 transition-all hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="rounded-xl bg-slate-100 p-3">
                  <FolderOpen size={22} />
                </div>

                <div>
                  <h2 className="text-xl font-semibold">
                    Criterion {criterion.id}
                  </h2>

                  <p className="mt-1 font-medium text-muted-foreground">
                    {criterion.title}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {criterion.subcategories.map((subcategory) => (
                      <span
                        key={subcategory.id}
                        className="rounded-full bg-slate-100 px-3 py-1 text-sm"
                      >
                        {subcategory.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <Button variant="outline">
                Open

                <ChevronRight size={18} className="ml-2" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}