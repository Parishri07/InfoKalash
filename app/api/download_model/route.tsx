import BASE_URL from "@/utils/apiConfig";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Only GET requests are allowed." });
  }

  try {
    const response = await fetch(`${BASE_URL}/download_model`);
    if (!response.ok) {
      throw new Error("Error downloading model");
    }

    const buffer = await response.arrayBuffer();
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", "attachment; filename=model.zip");
    res.send(Buffer.from(buffer));
  } catch (error: any) {
    console.error("Error in download_model:", error);
    res.status(500).json({ error: error.message });
  }
}
