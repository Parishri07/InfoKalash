import BASE_URL from "@/utils/apiConfig";

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

export async function GET(req: Request): Promise<Response> {
  try {
    const response = await fetch(`${BASE_URL}/feature_importance`);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const result: FeatureImportanceResponse = await response.json();
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in feature_importance:", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
    return new Response(JSON.stringify({ error: "An unknown error occurred" }), { status: 500 });
  }
}
