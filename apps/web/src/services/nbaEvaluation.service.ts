import { supabase } from "@/lib/supabase";

export interface NbaEvaluation {
  id: string;
  document_id: string;
  criterion: number;
  evidence_requirement: string;

  ai_score: number;
  rule_score: number;
  confidence: number | null;

  issues: string[];
  recommendations: string[];

  analysis: string | null;

  created_at: string;
  updated_at: string;
}

export interface CreateNbaEvaluation {
  document_id: string;
  criterion: number;
  evidence_requirement: string;

  ai_score: number;
  rule_score: number;
  confidence?: number | null;

  issues?: string[];
  recommendations?: string[];

  analysis?: string | null;
}

export async function getNbaEvaluations(
  documentId?: string,
  criterion?: number
) {
  let query = supabase
    .from("nba_evaluations")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (documentId) {
    query = query.eq(
      "document_id",
      documentId
    );
  }

  if (criterion) {
    query = query.eq(
      "criterion",
      criterion
    );
  }

  return query;
}

export async function getNbaEvaluation(
  documentId: string
) {
  const {
    data,
    error,
  } = await supabase
    .from("nba_evaluations")
    .select("*")
    .eq(
      "document_id",
      documentId
    )
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as NbaEvaluation | null;
}

export async function createNbaEvaluation(
  evaluation: CreateNbaEvaluation
) {
  const {
    data,
    error,
  } = await supabase
    .from("nba_evaluations")
    .upsert(
      {
        document_id:
          evaluation.document_id,

        criterion:
          evaluation.criterion,

        evidence_requirement:
          evaluation.evidence_requirement,

        ai_score:
          evaluation.ai_score,

        rule_score:
          evaluation.rule_score,

        confidence:
          evaluation.confidence ?? null,

        issues:
          evaluation.issues ?? [],

        recommendations:
          evaluation.recommendations ?? [],

        analysis:
          evaluation.analysis ?? null,

        updated_at:
          new Date().toISOString(),
      },
      {
        onConflict:
          "document_id,criterion,evidence_requirement",
      }
    )
    .select()
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as NbaEvaluation;
}

export async function updateNbaEvaluation(
  id: string,
  evaluation: Partial<CreateNbaEvaluation>
) {
  const {
    data,
    error,
  } = await supabase
    .from("nba_evaluations")
    .update({
      ...evaluation,
      updated_at:
        new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as NbaEvaluation;
}

export async function deleteNbaEvaluation(
  id: string
) {
  const {
    error,
  } = await supabase
    .from("nba_evaluations")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function evaluateNbaDocument(
  fileUrl: string,
  documentTitle: string,
  criterion: number,
  evidenceRequirement: string
) {
  const {
    data,
    error,
  } = await supabase.functions.invoke(
    "evaluate-nba-document",
    {
      body: {
        file_url: fileUrl,
        document_title:
          documentTitle,
        criterion,
        evidence_requirement:
          evidenceRequirement,
      },
    }
  );

  if (error) {
    throw error;
  }

  if (!data?.success) {
    throw new Error(
      data?.error ??
        "NBA evaluation failed."
    );
  }

  return data;
}