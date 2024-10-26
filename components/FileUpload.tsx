'use client';

import { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [targetColumn, setTargetColumn] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !targetColumn) {
      alert('Please upload a file and select the target column.');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_column', targetColumn);

    try {
      const { data } = await axios.post('http://localhost:8080/upload_csv', formData);
      setResponse(data.message || 'Training started successfully.');
    } catch (error) {
      console.error(error);
      setResponse('Error starting training.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Upload CSV for ML Model Training</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Upload CSV</label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Select Target Column</label>
          <input
            type="text"
            value={targetColumn}
            onChange={(e) => setTargetColumn(e.target.value)}
            placeholder="Enter target column name"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          {isLoading ? 'Training...' : 'Start Training'}
        </button>
      </form>

      {response && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded">
          {response}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
