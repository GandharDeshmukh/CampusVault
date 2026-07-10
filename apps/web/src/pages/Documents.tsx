import DocumentsModule from "@/components/documents/module/DocumentsModule";

export default function Documents() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">
          Documents
        </h1>

        <p className="text-muted-foreground">
          All Department Documents
        </p>
      </div>

      <DocumentsModule />
    </div>
  );
}