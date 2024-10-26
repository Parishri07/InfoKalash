import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, File as FormidableFile, Files } from 'formidable';
import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to handle string[] | string | undefined
function getStringOrJoin(arr: string[] | string | undefined): string | undefined {
  if (Array.isArray(arr)) {
    return arr.join(',');
  }
  return arr;
}

// Helper function to check if files contain a single file or multiple files
function getSingleFile(files: any, fieldName: string): FormidableFile | null {
  const file = files[fieldName];
  if (!file) return null;
  if (Array.isArray(file)) return file[0];
  return file as FormidableFile;
}

// Define the POST handler
export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const form = new IncomingForm();

  form.parse(req, async (err, fields, files: Files) => {
    if (err) {
      res.status(500).json({ error: 'Error parsing the form' });
      return;
    }

    const targetColumn = getStringOrJoin(fields.target_column);
    const featureColumns = getStringOrJoin(fields.feature_columns);

    const file = getSingleFile(files, 'file');
    if (!file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const filePath = file.filepath;

    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    formData.append('target_column', targetColumn ?? '');
    formData.append('feature_columns', featureColumns ?? '');

    try {
      const response = await fetch('https://910a-34-19-63-63.ngrok-free.app/upload_csv', {
        method: 'POST',
        body: formData,
        headers: formData.getHeaders(),
      });

      const result = await response.json();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Error uploading the file to the server' });
    }
  });
}
