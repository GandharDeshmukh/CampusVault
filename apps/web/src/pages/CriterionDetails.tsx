import { useParams } from "react-router-dom";

import CriterionAccordion from "@/components/nba/CriterionAccordion";

export default function CriterionDetails() {
  const { criterionId } = useParams();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Criterion {criterionId}
        </h1>

        <p className="mt-2 text-muted-foreground">
          NBA Accreditation Repository
        </p>
      </div>

      <CriterionAccordion />
    </div>
  );
}