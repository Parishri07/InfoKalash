import BASE_URL from "@/utils/apiConfig";

interface TrainingStatusResponse {
  status: string;
  message: string;
}

// Named export for the GET method
export async function GET(): Promise<Response> {
  try {
    const response = await fetch(`${BASE_URL}/training_status`);
    const result: TrainingStatusResponse = await response.json();

    console.log(result)

    return new Response(JSON.stringify(result), { status: response.status });
  } catch (error: any) {
    console.error("Error in training_status:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
