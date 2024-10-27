'use client';

import { useState, useEffect } from 'react';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [targetColumn, setTargetColumn] = useState<string>('');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<string[][]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingComplete, setTrainingComplete] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      if (uploadedFile.type !== 'text/csv') {
        setError('Please upload a valid CSV file.');
        return;
      }
      setError(null);
      setFile(uploadedFile);
      parseCSV(uploadedFile);
    }
  };

  const parseCSV = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').map(line => line.split(',').map(col => col.trim()));
      const firstLine = lines[0];
      setColumns(firstLine);
      setPreviewData(lines.slice(0, 5));
    };
    reader.readAsText(file);
  };

  const handleColumnSelection = (col: string) => {
    setSelectedColumns((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
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
      const res = await fetch('/api/upload_csv', { method: 'POST', body: formData });
      if (!res.ok) {
        const errorText = await res.text();
        alert(`Error: ${errorText}`);
        return;
      }
      setIsTraining(true);
      pollTrainingStatus();
    } catch (error) {
      console.error('Error submitting the form:', error);
      alert('An error occurred while submitting the form');
    }
  };

  const pollTrainingStatus = () => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/training_status');
        const status = await res.json();

        console.log(status);

        if (status.is_training) {
          setTrainingComplete(true);
          setIsTraining(false);
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Error checking training status:', error);
      }
    }, 10000); // Check every 10 seconds
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12">
      <h1 className="text-4xl font-bold mb-6">Upload CSV & Select Columns</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-6">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="border rounded p-2"
        />
      </div>

      {columns.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Select Target Column</h2>
          <select
            onChange={(e) => setTargetColumn(e.target.value)}
            className="border rounded p-2"
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
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Select Feature Columns</h2>
          <div className="grid grid-cols-3 gap-4">
            {columns.map((col) => (
              <div key={col}>
                <input
                  type="checkbox"
                  id={col}
                  value={col}
                  onChange={() => handleColumnSelection(col)}
                />
                <label htmlFor={col} className="ml-2">
                  {col}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {previewData.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Preview Data</h2>
          <table className="table-auto border-collapse border">
            <thead>
              <tr>
                {previewData[0].map((col, idx) => (
                  <th key={idx} className="border px-4 py-2">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewData.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((col, colIndex) => (
                    <td key={colIndex} className="border px-4 py-2">
                      {col}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
      >
        Train Model
      </button>

      {isTraining && <p className="mt-4">Training in progress...</p>}
      {trainingComplete && <p className="mt-4 text-green-500">Model training complete!</p>}
    </div>
  );
}
