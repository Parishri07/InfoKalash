import BASE_URL from "@/utils/apiConfig";
import type { NextApiRequest, NextApiResponse } from "next";

interface FeatureImportance {
  feature: string;
  percentage: number;
  relative_importance: number;
  scaled_importance: number;
}

interface FeatureImportanceResponse {
  feature_importance: FeatureImportance[];
  model_type: string;
}

// Exporting a named export for the GET method
export async function GET(req: NextApiRequest, res: NextApiResponse<FeatureImportanceResponse | { error: string }>) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Only GET requests are allowed." });
  }

  try {
    const response = await fetch(`${BASE_URL}/feature_importance`);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const result: FeatureImportanceResponse = await response.json();
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error: any) {
    console.error("Error in feature_importance:", error);
    return res.status(500).json({ error: error.message });
  }
}
