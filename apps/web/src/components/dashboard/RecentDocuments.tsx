import { Card } from "@workspace/ui/components/card";
import { FileText } from "lucide-react";

const documents = [
  {
    name: "NAAC_Report_2026.pdf",
    department: "IQAC",
  },
  {
    name: "NBA_Criteria_3.pdf",
    department: "Computer",
  },
  {
    name: "Research_Publications.xlsx",
    department: "ECE",
  },
  {
    name: "Placement_Statistics.pdf",
    department: "Training & Placement",
  },
];

export default function RecentDocuments() {
  return (
    <Card className="rounded-2xl p-6 shadow-md">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Recent Documents
        </h2>

        <FileText className="text-blue-600" />
      </div>

      <div className="space-y-4">
        {documents.map((doc) => (
          <div
            key={doc.name}
            className="flex items-center justify-between rounded-xl bg-slate-50 p-4 transition hover:bg-slate-100"
          >
            <div>
              <p className="font-medium">
                {doc.name}
              </p>

              <p className="text-sm text-slate-500">
                {doc.department}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}