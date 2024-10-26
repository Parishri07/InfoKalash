import { NextRequest, NextResponse } from 'next/server';
import BASE_URL from "@/utils/apiConfig";

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const file = formData.get('file') as Blob;

  // Prepare a new FormData object for sending to the external API
  const uploadFormData = new FormData();
  uploadFormData.append('file', file);

  try {
    // Forward the formData to the external API endpoint
    const response = await fetch(`${BASE_URL}/upload_test_csv`, {
      method: 'POST',
      body: uploadFormData,
    });

    // Check if the response from the external API is OK, then return it
    if (response.ok) {
      const result = await response.json();
      return new Response(JSON.stringify(result), { status: 200 })
    } else {
      const errorText = await response.text();
      return NextResponse.json({ error: errorText }, { status: response.status });
    }
  } catch (error) {
    console.error('Failed to upload file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
};
