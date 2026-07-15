import { useState } from "react";

import UploadDocumentModal from "@/components/documents/UploadDocumentModal";
import DocumentsGrid from "@/components/documents/DocumentsGrid";
import DocumentSearch from "@/components/documents/DocumentSearch";

interface Props {
  department?: string;
  criterion?: number;
  subcategory?: string;
}

export default function DocumentsModule({
  department,
  criterion,
  subcategory,
}: Props) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [search, setSearch] = useState("");

  function refreshDocuments() {
    setRefreshKey((prev) => prev + 1);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <DocumentSearch
          value={search}
          onChange={setSearch}
        />

        <UploadDocumentModal
          department={department}
          criterion={criterion}
          subcategory={subcategory}
          onUploadSuccess={refreshDocuments}
        />
      </div>

      <DocumentsGrid
        refreshKey={refreshKey}
        search={search}
        department={department}
        criterion={criterion}
        subcategory={subcategory}
      />
    </div>
  );
}