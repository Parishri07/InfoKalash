'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";

export default function TestPage() {
  const [testFile, setTestFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTestFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedTestFile = event.target.files?.[0];
    if (uploadedTestFile) {
      if (uploadedTestFile.type !== 'text/csv') {
        setError('Please upload a valid CSV file for testing.');
        return;
      }
      setError(null);
      setTestFile(uploadedTestFile);
    }
  };

  const handleTestFileSubmit = async () => {
    if (!testFile) {
      alert('Please upload a test file');
      return;
    }

    const formData = new FormData();
    formData.append('file', testFile);

    try {
      const res = await fetch('/api/upload_test_csv', { method: 'POST', body: formData });
      if (!res.ok) {
        const errorText = await res.text();
        alert(`Error: ${errorText}`);
        return;
      }

      const result = await res.json();
      const jsonString = JSON.stringify(result, null, 2); 
      const blob = new Blob([jsonString], { type: 'application/json' }); 
      const url = URL.createObjectURL(blob); 

      const a = document.createElement('a');
      a.href = url;
      a.download = 'test_upload_results.json'; 
      document.body.appendChild(a); 
      a.click(); 
      document.body.removeChild(a); 
      URL.revokeObjectURL(url); 
    } catch (error) {
      console.error('Error submitting the test file:', error);
      alert('An error occurred while submitting the test file');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12">
      <Card className="max-w-3xl w-full">
        <CardHeader>
          <CardTitle className="text-4xl font-bold">Upload Test CSV</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <Alert variant="destructive">{error}</Alert>}

          <div className="mb-6">
            <input
              type="file"
              accept=".csv"
              onChange={handleTestFileUpload}
              className="border rounded p-2 w-full"
            />
          </div>

          <Button
            onClick={handleTestFileSubmit}
            className="bg-green-500 text-white w-full"
          >
            Upload Test CSV & Download Results
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
