'use client';

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [targetColumn, setTargetColumn] = useState<string>('');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      parseCSV(uploadedFile);
    }
  };

  const parseCSV = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const firstLine = text.split('\n')[0];
      const cols = firstLine.split(',');
      setColumns(cols);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    if (!file || !targetColumn || selectedColumns.length === 0) {
      alert('Please select a file, target column, and feature columns');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_column', targetColumn);
    formData.append('feature_columns', JSON.stringify(selectedColumns));
  
    try {
      const res = await fetch('/api/upload_csv', {
        method: 'POST',
        body: formData,
      });
  
      if (!res.ok) {
        // Check if the response is an error and handle it
        const errorText = await res.text();
        console.error('Error:', errorText);
        alert(`Error: ${errorText}`);
        return;
      }
  
      const result = await res.json();
      console.log(result);
    } catch (error) {
      console.error('Error submitting the form:', error);
      alert('An error occurred while submitting the form');
    }
  };
  

  const handleColumnSelection = (col: string) => {
    setSelectedColumns((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12">
      <h1 className="text-4xl font-bold mb-6">Upload CSV & Select Columns</h1>

      <div className="mb-6">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="border rounded p-2"
        />
      </div>

      {columns.length > 0 && (
        <div className="mb-6 w-full max-w-lg">
          <h2 className="text-xl font-semibold mb-2">Select Target Column</h2>
          <select
            className="w-full p-2 border rounded"
            value={targetColumn}
            onChange={(e) => setTargetColumn(e.target.value)}
          >
            <option value="">Select Target Column</option>
            {columns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>
      )}

      {columns.length > 0 && (
        <div className="mb-6 w-full max-w-lg">
          <h2 className="text-xl font-semibold mb-2">Select Feature Columns</h2>
          <div className="flex flex-col">
            {columns.map((col) => (
              <label key={col} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedColumns.includes(col)}
                  onChange={() => handleColumnSelection(col)}
                />
                <span>{col}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </div>
  );
}
