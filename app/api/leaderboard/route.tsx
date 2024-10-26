import BASE_URL from "@/utils/apiConfig";
import type { NextApiRequest, NextApiResponse } from "next";

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

// Exporting a named export for the GET method
export async function GET(req: NextApiRequest, res: NextApiResponse<LeaderboardResponse | { error: string }>) {
  try {
    const response = await fetch(`${BASE_URL}/leaderboard`);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const result: LeaderboardResponse = await response.json();
    // console.log(result);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error: any) {
    console.error("Error in leaderboard:", error);
    return res.status(500).json({ error: error.message });
  }
}
