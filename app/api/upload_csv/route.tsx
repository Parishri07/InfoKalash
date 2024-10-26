import { NextRequest, NextResponse } from 'next/server';
import BASE_URL from "@/utils/apiConfig";

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const file = formData.get('file') as Blob;
  const targetColumn = formData.get('target_column') as string;
  const featureColumnsString = formData.get('feature_columns') as string;

  console.log(featureColumnsString)
  console.log(targetColumn)

  // Parse feature columns from JSON string to array
  let featureColumns: string[];
  try {
    featureColumns = JSON.parse(featureColumnsString);
  } catch (error) {
    console.error('Error parsing feature columns:', error);
    return NextResponse.json({ error: 'Invalid feature columns format' }, { status: 400 });
  }

  // Prepare a new FormData object for sending to the external API
  const uploadFormData = new FormData();
  uploadFormData.append('file', file);
  uploadFormData.append('target_column', targetColumn);
  uploadFormData.append('feature_columns', JSON.stringify(featureColumns)); // Ensure it's JSON string

  try {
    // Forward the formData to the external API endpoint
    const response = await fetch(`${BASE_URL}/upload_csv`, {
      method: 'POST',
      body: uploadFormData,
    });

    // Check if the response from the external API is OK, then return it
    if (response.ok) {
      const result = await response.json();
      return NextResponse.json(result);
    } else {
      const errorText = await response.text();
      console.error('Error from external API:', errorText);
      return NextResponse.json({ error: errorText }, { status: response.status });
    }
  } catch (error) {
    console.error('Failed to upload file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
};
