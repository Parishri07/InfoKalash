'use client';

import { useState } from 'react';

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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12">
      <h1 className="text-4xl font-bold mb-6">Upload Test CSV</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-6">
        <input
          type="file"
          accept=".csv"
          onChange={handleTestFileUpload}
          className="border rounded p-2"
        />
      </div>

      <button
        onClick={handleTestFileSubmit}
        className="bg-green-500 text-white px-4 py-2 rounded mb-6"
      >
        Upload Test CSV & Download Results
      </button>
    </div>
  );
}
