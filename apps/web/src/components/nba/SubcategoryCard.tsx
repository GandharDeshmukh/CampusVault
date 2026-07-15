import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Upload,
} from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";

interface Props {
  title: string;
  department?: string;
  criterion: number;
  subcategory: string;
}

export default function SubcategoryCard({
  title,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Card className="overflow-hidden rounded-xl border">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-4 text-left transition hover:bg-slate-50"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-slate-100 p-3">
            <FileText size={18} />
          </div>

          <div>
            <h3 className="font-medium">{title}</h3>

            <p className="text-sm text-muted-foreground">
              0 Documents
            </p>
          </div>
        </div>

        {open ? (
          <ChevronDown size={20} />
        ) : (
          <ChevronRight size={20} />
        )}
      </button>

      {open && (
        <div className="border-t bg-slate-50 p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold">
              Documents
            </p>

            <Button disabled size="sm">
              <Upload
                size={16}
                className="mr-2"
              />
              Upload
            </Button>
          </div>

          <div className="rounded-xl border border-dashed bg-white p-8 text-center">
            <FileText
              size={32}
              className="mx-auto mb-3 text-slate-400"
            />

            <p className="font-medium text-slate-700">
              No documents uploaded
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Upload documents for this NBA
              subcategory.
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}