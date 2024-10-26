import BASE_URL from "@/utils/apiConfig";
import type { NextApiRequest, NextApiResponse } from "next";

interface UploadTestCSVResponse {
  message: string;
  status: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UploadTestCSVResponse | { error: string }>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests are allowed." });
  }

  try {
    const formData = new FormData();
    formData.append("file", req.body.file);

    const response = await fetch(`${BASE_URL}/upload_test_csv`, {
      method: "POST",
      body: formData,
    });

    const result = (await response.json()) as UploadTestCSVResponse;
    res.status(response.status).json(result);
  } catch (error: any) {
    console.error("Error in upload_test_csv:", error);
    res.status(500).json({ error: error.message });
  }
}
