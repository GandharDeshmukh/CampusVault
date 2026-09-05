import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Download,
  FileBarChart,
} from "lucide-react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { Card } from "@workspace/ui/components/card";

import { nbaCriteria } from "@/data/nbaCriteria";
import { nbaRequirements } from "@/data/nbaRequirements";
import { getDocuments } from "@/services/document.service";
import { departments } from "@/utils/departments";

export default function Reports() {
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

    loadReport();
  }, [department]);

  async function loadReport() {
    if (!department) return;

    const { data, error } = await getDocuments(
      department
    );

    if (error) {
      console.error(
        "Failed to load report:",
        error
      );
      return;
    }

    const documentCountMap: Record<
      number,
      number
    > = {};

    const evidenceMap: Record<
      number,
      Set<string>
    > = {};

    nbaCriteria.forEach((criterion) => {
      documentCountMap[criterion.id] = 0;
      evidenceMap[criterion.id] = new Set();
    });

    data?.forEach((document) => {
      if (document.criterion !== null) {
        documentCountMap[document.criterion] =
          (documentCountMap[document.criterion] ??
            0) + 1;

        if (document.evidence_requirement) {
          evidenceMap[document.criterion]?.add(
            document.evidence_requirement
          );
        }
      }
    });

    const evidenceCountMap: Record<
      number,
      number
    > = {};

    nbaCriteria.forEach((criterion) => {
      evidenceCountMap[criterion.id] =
        evidenceMap[criterion.id]?.size ?? 0;
    });

    setDocumentCounts(documentCountMap);
    setEvidenceCounts(evidenceCountMap);
  }

  function handleDepartmentChange(
    e: React.ChangeEvent<HTMLSelectElement>
  ) {
    const value = e.target.value;

    if (!value) {
      navigate("/reports");
      return;
    }

    navigate(`/reports/${value}`);
  }

  function handleExportPdf() {
    window.print();
  }

  function getRequiredEvidence(
    criterionId: number
  ) {
    return (
      nbaRequirements[criterionId]?.reduce(
        (total, subcategory) =>
          total + subcategory.requirements.length,
        0
      ) ?? 0
    );
  }

  const totalRequired = nbaCriteria.reduce(
    (total, criterion) =>
      total + getRequiredEvidence(criterion.id),
    0
  );

  const totalUploaded = Object.values(
    documentCounts
  ).reduce(
    (sum, count) => sum + count,
    0
  );

  const totalCompletedEvidence =
    Object.values(evidenceCounts).reduce(
      (sum, count) => sum + count,
      0
    );

  const overallProgress =
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
      const required = getRequiredEvidence(
        criterion.id
      );

      const completed =
        evidenceCounts[criterion.id] ?? 0;

      return (
        required > 0 &&
        completed >= required
      );
    }
  ).length;

  return (
    <div className="reports-page space-y-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="report-header flex items-center justify-between gap-6">

        <div className="flex items-center gap-4">

          <div className="report-icon rounded-2xl bg-primary/10 p-3.5 print-hidden">
            <FileBarChart
              size={28}
              className="text-primary"
            />
          </div>

          <div>
            <p className="report-kicker text-sm font-semibold uppercase tracking-wider text-primary">
              CampusVault
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              NBA Accreditation Readiness Report
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              {departmentName ??
                "Select a department"}
            </p>
          </div>

        </div>

        <button
          onClick={handleExportPdf}
          disabled={!department}
          className="print-hidden inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
        >
          <Download size={17} />
          Export PDF
        </button>

      </div>

      {/* =====================================================
          DEPARTMENT SELECTOR
      ===================================================== */}

      <Card className="print-hidden rounded-2xl p-5">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">
            Department
          </label>

          <select
            value={department ?? ""}
            onChange={handleDepartmentChange}
            className="h-10 min-w-[320px] rounded-lg border bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-primary"
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
      </Card>

      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {!department ? (
        <Card className="print-hidden flex min-h-[250px] items-center justify-center rounded-2xl border">
          <div className="text-center">
            <FileBarChart
              size={40}
              className="mx-auto mb-4 text-muted-foreground"
            />

            <h2 className="text-lg font-semibold">
              Select a Department
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Select a department to generate its NBA
              readiness report.
            </p>
          </div>
        </Card>
      ) : (
        <>
          {/* =================================================
              PRINT INFORMATION
          ================================================= */}

          <div className="report-meta hidden">

            <div>
              <span>Department</span>
              <strong>
                {departmentName}
              </strong>
            </div>

            <div>
              <span>Report Type</span>
              <strong>
                NBA Accreditation Readiness
              </strong>
            </div>

            <div>
              <span>Generated On</span>
              <strong>
                {new Date().toLocaleDateString(
                  "en-IN",
                  {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </strong>
            </div>

          </div>

          {/* =================================================
              SUMMARY CARDS
          ================================================= */}

          <div className="summary-grid grid gap-4 md:grid-cols-3">

            {/* DOCUMENTS */}

            <Card className="summary-card rounded-2xl border p-5">
              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Documents Uploaded
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {totalUploaded}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Documents available for this department
                  </p>
                </div>

                <div className="rounded-lg bg-muted p-2.5">
                  <FileBarChart size={18} />
                </div>

              </div>
            </Card>

            {/* EVIDENCE */}

            <Card className="summary-card rounded-2xl border p-5">

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Evidence Coverage
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {totalCompletedEvidence}
                    <span className="text-lg font-medium text-muted-foreground">
                      {" "}
                      / {totalRequired}
                    </span>
                  </p>
                </div>

                <div className="rounded-lg bg-muted p-2.5">
                  <CheckCircle2 size={18} />
                </div>

              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${overallProgress}%`,
                  }}
                />
              </div>

              <p className="mt-1.5 text-xs text-muted-foreground">
                {overallProgress}% evidence coverage
              </p>

            </Card>

            {/* CRITERIA */}

            <Card className="summary-card rounded-2xl border p-5">

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Criteria Complete
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {completedCriteria}
                    <span className="text-lg font-medium text-muted-foreground">
                      {" "}
                      / {nbaCriteria.length}
                    </span>
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Criteria with complete evidence
                  </p>
                </div>

                <div className="rounded-lg bg-muted p-2.5">
                  <CheckCircle2 size={18} />
                </div>

              </div>

            </Card>

          </div>

          {/* =================================================
              CRITERION TABLE
          ================================================= */}

          <Card className="criterion-report overflow-hidden rounded-2xl border">

            {/* TABLE HEADER */}

            <div className="criterion-report-header border-b p-6">

              <div className="flex items-center justify-between gap-4">

                <div>
                  <h2 className="text-xl font-semibold">
                    Criterion-wise Readiness
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Evidence preparation status across all NBA
                    accreditation criteria.
                  </p>
                </div>

                <div className="report-table-summary print-hidden">
                  <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium">
                    {totalCompletedEvidence} of{" "}
                    {totalRequired} evidence items
                  </span>
                </div>

              </div>

            </div>

            {/* TABLE */}

            <div className="overflow-x-auto">
              <table className="w-full text-sm">

                <thead>
                  <tr className="border-b bg-muted/40">

                    <th className="px-6 py-4 text-left font-semibold">
                      Criterion
                    </th>

                    <th className="px-5 py-4 text-center font-semibold">
                      Required
                    </th>

                    <th className="px-5 py-4 text-left font-semibold">
                      Evidence
                    </th>

                    <th className="px-6 py-4 text-left font-semibold">
                      Progress
                    </th>

                    <th className="px-6 py-4 text-left font-semibold">
                      Status
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {nbaCriteria.map(
                    (criterion, index) => {

                      const uploaded =
                        documentCounts[
                          criterion.id
                        ] ?? 0;

                      const completed =
                        evidenceCounts[
                          criterion.id
                        ] ?? 0;

                      const required =
                        getRequiredEvidence(
                          criterion.id
                        );

                      const progress =
                        required === 0
                          ? 0
                          : Math.min(
                              Math.round(
                                (completed /
                                  required) *
                                  100
                              ),
                              100
                            );

                      const complete =
                        required > 0 &&
                        completed >= required;

                      const started =
                        completed > 0;

                      return (
                        <tr
                          key={criterion.id}
                          className={`
                            criterion-row
                            border-b
                            last:border-0
                            ${
                              index % 2 === 1
                                ? "bg-muted/20"
                                : "bg-background"
                            }
                          `}
                        >

                          {/* CRITERION */}

                          <td className="px-6 py-4">

                            <div>
                              <p className="font-semibold">
                                Criterion{" "}
                                {criterion.id}
                              </p>

                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {
                                  criterion.shortTitle
                                }
                              </p>
                            </div>

                          </td>

                          {/* REQUIRED */}

                          <td className="px-5 py-4 text-center">

                            <span className="font-semibold">
                              {required}
                            </span>

                            <p className="mt-0.5 text-[10px] text-muted-foreground">
                              evidence items
                            </p>

                          </td>

                          {/* EVIDENCE */}

                          <td className="px-5 py-4">

                            <div className="flex items-baseline gap-1">

                              <span className="font-semibold">
                                {completed}
                              </span>

                              <span className="text-muted-foreground">
                                / {required}
                              </span>

                            </div>

                            <p className="mt-0.5 text-[11px] text-muted-foreground">
                              {uploaded} uploaded{" "}
                              {uploaded === 1
                                ? "document"
                                : "documents"}
                            </p>

                          </td>

                          {/* PROGRESS */}

                          <td className="px-6 py-4">

                            <div className="flex items-center gap-3">

                              <div className="w-full max-w-[220px]">

                                <div className="h-2 overflow-hidden rounded-full bg-muted">

                                  <div
                                    className="h-full rounded-full bg-primary transition-all"
                                    style={{
                                      width: `${progress}%`,
                                    }}
                                  />

                                </div>

                              </div>

                              <span className="min-w-[35px] text-right text-xs font-semibold">
                                {progress}%
                              </span>

                            </div>

                          </td>

                          {/* STATUS */}

                          <td className="px-6 py-4">

                            {complete ? (
                              <span className="status-badge inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700">

                                <CheckCircle2
                                  size={14}
                                />

                                Complete

                              </span>
                            ) : started ? (
                              <span className="status-badge inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1.5 text-xs font-semibold text-yellow-700">

                                <Clock3
                                  size={14}
                                />

                                In Progress

                              </span>
                            ) : (
                              <span className="status-badge inline-flex items-center rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                                Not Started
                              </span>
                            )}

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>
            </div>

          </Card>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="print-footer hidden">

            <div>
              <strong>CampusVault</strong>
              <span>
                {" "}
                — Digital Accreditation Portal
              </span>
            </div>

            <div>
              NBA Accreditation Readiness Report
            </div>

          </div>
        </>
      )}

      {/* =====================================================
          PRINT STYLES
      ===================================================== */}

      <style>{`

        @page {
          size: A4 landscape;
          margin: 8mm;
        }

        @media print {

          * {
            box-sizing: border-box;
          }

          html,
          body,
          #root,
          main {
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            background: white !important;
            color: #111827 !important;
          }

          #root,
          main,
          main > div,
          .reports-page {
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            overflow: visible !important;
          }

          /* -----------------------------------------------
             HIDE APPLICATION UI
          ----------------------------------------------- */

          aside,
          header,
          nav,
          .print-hidden {
            display: none !important;
          }

          /* -----------------------------------------------
             REPORT CONTAINER
          ----------------------------------------------- */

          .reports-page {
            display: block !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .reports-page > * {
            margin-bottom: 7px !important;
          }

          /* -----------------------------------------------
             REPORT HEADER
          ----------------------------------------------- */

          .report-header {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;

            border-bottom: 2px solid #111827 !important;

            padding-bottom: 7px !important;
            margin-bottom: 6px !important;
          }

          .report-icon {
            display: none !important;
          }

          .report-kicker {
            font-size: 8px !important;
            line-height: 1 !important;
            margin: 0 !important;
            letter-spacing: 1px !important;
          }

          .report-header h1 {
            font-size: 20px !important;
            line-height: 1.1 !important;
            margin: 2px 0 0 !important;
            letter-spacing: -0.2px !important;
          }

          .report-header p {
            font-size: 8px !important;
            line-height: 1.1 !important;
            margin-top: 2px !important;
          }

          /* -----------------------------------------------
             META INFORMATION
          ----------------------------------------------- */

          .report-meta {
            display: grid !important;
            grid-template-columns:
              1.5fr
              1.5fr
              1fr !important;

            gap: 6px !important;
            margin-bottom: 7px !important;
          }

          .report-meta div {
            border: 1px solid #cbd5e1 !important;
            border-radius: 4px !important;
            padding: 6px 8px !important;
            background: #f8fafc !important;
          }

          .report-meta span {
            display: block !important;
            color: #64748b !important;
            font-size: 7px !important;
            line-height: 1 !important;
            margin-bottom: 3px !important;
          }

          .report-meta strong {
            display: block !important;
            color: #111827 !important;
            font-size: 9px !important;
            line-height: 1.1 !important;
          }

          /* -----------------------------------------------
             SUMMARY CARDS
          ----------------------------------------------- */

          .summary-grid {
            display: grid !important;
            grid-template-columns:
              repeat(3, 1fr) !important;

            gap: 7px !important;

            margin-bottom: 7px !important;
          }

          .summary-card {
            height: 72px !important;
            min-height: 72px !important;

            padding: 8px 10px !important;

            border: 1px solid #cbd5e1 !important;
            border-radius: 5px !important;

            box-shadow: none !important;

            background: white !important;
          }

          .summary-card p {
            line-height: 1.05 !important;
          }

          .summary-card p:first-child {
            font-size: 7px !important;
            font-weight: 600 !important;
            color: #64748b !important;
            margin: 0 !important;
          }

          .summary-card p.text-3xl {
            font-size: 18px !important;
            line-height: 1 !important;
            margin-top: 4px !important;
          }

          .summary-card p.text-xs {
            font-size: 7px !important;
            line-height: 1 !important;
            margin-top: 3px !important;
          }

          .summary-card > div {
            margin: 0 !important;
          }

          .summary-card > div > div:last-child {
            display: none !important;
          }

          .summary-card div[style*="width"] {
            height: 4px !important;
            margin-top: 4px !important;
          }

          /* -----------------------------------------------
             TABLE CARD
          ----------------------------------------------- */

          .criterion-report {
            width: 100% !important;

            border: 1px solid #94a3b8 !important;
            border-radius: 5px !important;

            overflow: visible !important;

            box-shadow: none !important;

            margin: 0 !important;
          }

          .criterion-report-header {
            padding: 8px 10px !important;
            border-bottom: 1px solid #cbd5e1 !important;
          }

          .criterion-report h2 {
            font-size: 12px !important;
            line-height: 1.1 !important;
            margin: 0 !important;
          }

          .criterion-report-header p {
            font-size: 7px !important;
            line-height: 1 !important;
            margin-top: 2px !important;
          }

          .criterion-report
          .overflow-x-auto {
            overflow: visible !important;
            max-height: none !important;
          }

          /* -----------------------------------------------
             TABLE
          ----------------------------------------------- */

          .criterion-report table {
            width: 100% !important;

            min-width: 0 !important;

            table-layout: fixed !important;

            border-collapse: collapse !important;

            font-size: 8px !important;
          }

          .criterion-report thead {
            display: table-header-group !important;
          }

          .criterion-report tbody {
            display: table-row-group !important;
          }

          .criterion-report tr {
            display: table-row !important;

            height: 36px !important;

            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          .criterion-report th,
          .criterion-report td {
            height: 36px !important;

            padding: 5px 8px !important;

            border: 1px solid #cbd5e1 !important;

            vertical-align: middle !important;

            line-height: 1.05 !important;
          }

          .criterion-report th {
            height: 28px !important;

            background: #f1f5f9 !important;

            color: #111827 !important;

            font-size: 8px !important;

            font-weight: 700 !important;

            text-transform: uppercase !important;

            letter-spacing: 0.2px !important;

            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
          }

          .criterion-report td p {
            line-height: 1.05 !important;
            margin: 0 !important;
          }

          /* -----------------------------------------------
             CRITERION COLUMN
          ----------------------------------------------- */

          .criterion-report
          th:nth-child(1),
          .criterion-report
          td:nth-child(1) {
            width: 34% !important;
          }

          .criterion-report
          th:nth-child(1)
          p:first-child,
          .criterion-report
          td:nth-child(1)
          p:first-child {
            font-size: 9px !important;
            font-weight: 700 !important;
          }

          .criterion-report
          th:nth-child(1)
          p:last-child,
          .criterion-report
          td:nth-child(1)
          p:last-child {
            font-size: 7px !important;
            color: #64748b !important;
            margin-top: 2px !important;
          }

          /* -----------------------------------------------
             REQUIRED COLUMN
          ----------------------------------------------- */

          .criterion-report
          th:nth-child(2),
          .criterion-report
          td:nth-child(2) {
            width: 11% !important;
            text-align: center !important;
          }

          /* -----------------------------------------------
             EVIDENCE COLUMN
          ----------------------------------------------- */

          .criterion-report
          th:nth-child(3),
          .criterion-report
          td:nth-child(3) {
            width: 15% !important;
          }

          /* -----------------------------------------------
             PROGRESS COLUMN
          ----------------------------------------------- */

          .criterion-report
          th:nth-child(4),
          .criterion-report
          td:nth-child(4) {
            width: 23% !important;
          }

          .criterion-report
          td:nth-child(4)
          > div {
            display: flex !important;
            align-items: center !important;
            gap: 7px !important;
          }

          .criterion-report
          td:nth-child(4)
          > div
          > div:first-child {
            width: 100% !important;
            max-width: none !important;
          }

          .criterion-report
          td:nth-child(4)
          div[style*="width"] {
            height: 5px !important;

            border-radius: 999px !important;

            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
          }

          .criterion-report
          td:nth-child(4)
          span {
            font-size: 8px !important;
            font-weight: 700 !important;
          }

          /* -----------------------------------------------
             STATUS COLUMN
          ----------------------------------------------- */

          .criterion-report
          th:nth-child(5),
          .criterion-report
          td:nth-child(5) {
            width: 17% !important;
          }

          .status-badge {
            padding: 4px 8px !important;

            font-size: 7px !important;

            line-height: 1 !important;

            white-space: nowrap !important;

            border-radius: 999px !important;

            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
          }

          .status-badge svg {
            width: 9px !important;
            height: 9px !important;
          }

          /* -----------------------------------------------
             EVIDENCE TEXT
          ----------------------------------------------- */

          .criterion-report
          td:nth-child(3)
          span {
            font-size: 9px !important;
          }

          .criterion-report
          td:nth-child(3)
          p {
            font-size: 7px !important;
            color: #64748b !important;
            margin-top: 2px !important;
          }

          /* -----------------------------------------------
             ALTERNATING ROWS
          ----------------------------------------------- */

          .criterion-row {
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
          }

          /* -----------------------------------------------
             FOOTER
          ----------------------------------------------- */

          .print-footer {
            display: flex !important;

            justify-content: space-between !important;
            align-items: center !important;

            border-top: 1px solid #cbd5e1 !important;

            padding-top: 5px !important;

            margin-top: 5px !important;

            font-size: 7px !important;

            color: #64748b !important;
          }

          .print-footer strong {
            color: #111827 !important;
          }

          /* -----------------------------------------------
             REMOVE UNNECESSARY EFFECTS
          ----------------------------------------------- */

          .reports-page
          [class*="rounded-2xl"] {
            box-shadow: none !important;
          }

          .reports-page
          [class*="rounded-xl"] {
            box-shadow: none !important;
          }

        }

      `}</style>
    </div>
  );
}