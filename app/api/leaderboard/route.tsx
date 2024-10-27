import BASE_URL from "@/utils/apiConfig";

interface Model {
  logloss: number;
  mean_per_class_error: number;
  model_id: string;
  mse: number;
  rmse: number;
}

interface BestModel {
  algorithm: string;
  model_id: string;
}

interface LeaderboardResponse {
  best_model: BestModel;
  models: Model[];
}

export async function GET(req: Request): Promise<Response> {
  try {
    const response = await fetch(`${BASE_URL}/leaderboard`);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const result: LeaderboardResponse = await response.json();
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in leaderboard:", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
    return new Response(JSON.stringify({ error: "An unknown error occurred" }), { status: 500 });
  }
}
