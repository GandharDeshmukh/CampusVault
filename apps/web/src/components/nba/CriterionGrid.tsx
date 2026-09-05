import { ArrowRight, FolderOpen } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";

import { nbaCriteria } from "@/data/nbaCriteria";

export default function CriterionGrid() {
  const navigate = useNavigate();
  const { department } = useParams();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          NBA Accreditation Repository
        </h1>

        <p className="mt-2 text-muted-foreground">
          Organize and manage documents according to NBA SAR criteria.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {nbaCriteria.map((criterion) => (
          <Card
            key={criterion.id}
            className="rounded-2xl border p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="rounded-xl bg-slate-100 p-3">
                <FolderOpen size={22} />
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
                Criterion {criterion.id}
              </span>
            </div>

            <h2 className="mt-6 text-xl font-semibold">
              {criterion.shortTitle}
            </h2>

            <p className="mt-3 text-sm text-muted-foreground">
              {criterion.subcategories.length} subcategories
            </p>

            <Button
              className="mt-6 w-full justify-between"
              onClick={() =>
                navigate(
                  `/department/${department}/documents/criterion/${criterion.id}`
                )
              }
            >
              Open Criterion

              <ArrowRight size={18} />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}