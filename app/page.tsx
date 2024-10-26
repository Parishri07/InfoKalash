'use client';

import { useState, useEffect } from 'react';
import Leaderboard from '@/components/LeaderBoard';
import FeatureImportance from '@/components/FeatureImportance'; // Import the new FeatureImportance component

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [targetColumn, setTargetColumn] = useState<string>('');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<string[][]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [trainingComplete, setTrainingComplete] = useState<boolean>(false);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [bestModel, setBestModel] = useState<any>(null);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState<boolean>(false);
  const [loadingPreview, setLoadingPreview] = useState<boolean>(false);
  const [featureImportanceData, setFeatureImportanceData] = useState<any[]>([]); // New state for feature importance data
  const [showFeatureImportance, setShowFeatureImportance] = useState<boolean>(false); // State to manage feature importance visibility
  const [loadingFeatureImportance, setLoadingFeatureImportance] = useState<boolean>(false); // State for loading indicator

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTraining) {
      interval = setInterval(async () => {
        try {
          const res = await fetch('/api/training_status');
          const status = await res.json();
          console.log('Training Status:', status);

          if (status.model_ready) {
            setIsTraining(false);
            setTrainingComplete(true);
            clearInterval(interval);
          }
        } catch (error) {
          console.error('Error fetching training status:', error);
        }
      }, 10000);
    }

    return () => clearInterval(interval);
  }, [isTraining]);

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
    setLoadingPreview(true); // Set loading state for preview
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').map(line => line.split(',').map(col => col.trim()));
      const firstLine = lines[0];
      setColumns(firstLine);
      setPreviewData(lines.slice(0, 5));
      setLoadingPreview(false); // Reset loading state
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
    formData.append('target_column', targetColumn.trim());
    formData.append('feature_columns', JSON.stringify(selectedColumns));

    try {
      const res = await fetch('/api/upload_csv', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error:', errorText);
        alert(`Error: ${errorText}`);
        return;
      }

      setIsTraining(true);
      resetForm();
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

  const resetForm = () => {
    setFile(null);
    setColumns([]);
    setTargetColumn('');
    setSelectedColumns([]);
    setPreviewData([]);
    setError(null);
    setTrainingComplete(false);
    setShowLeaderboard(false);
    setShowFeatureImportance(false); // Reset feature importance visibility
  };

  const handleLeaderboardClick = async () => {
    setLoadingLeaderboard(true); // Start loading
    try {
      const res = await fetch('/api/leaderboard', { method: 'GET' });

      if (!res.ok) {
        throw new Error('Failed to fetch leaderboard data');
      }

      const data = await res.json();
      console.log(data);
      setLeaderboardData(data.models);
      setBestModel(data.best_model);
      setShowLeaderboard(true);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      alert('An error occurred while fetching leaderboard data');
    } finally {
      setLoadingLeaderboard(false); // End loading
    }
  };

  const handleFeatureImportanceClick = async () => {
    setLoadingFeatureImportance(true); // Start loading
    try {
      const res = await fetch('/api/feature_importance', { method: 'GET' });

      if (!res.ok) {
        throw new Error('Failed to fetch feature importance data');
      }

      const data = await res.json();
      console.log(data);
      setFeatureImportanceData(data.feature_importance); // Assuming the response has a features array
      setShowFeatureImportance(true); // Show feature importance
    } catch (error) {
      console.error('Error fetching feature importance data:', error);
      alert('An error occurred while fetching feature importance data');
    } finally {
      setLoadingFeatureImportance(false); // End loading
    }
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

      {loadingPreview ? (
        <p>Loading preview data...</p>
      ) : (
        previewData.length > 0 && (
          <div className="mb-6 w-full max-w-lg overflow-auto">
            <h2 className="text-xl font-semibold mb-2">Preview Data</h2>
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col} className="border border-gray-300 p-2">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="border border-gray-300 p-2">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Submit
      </button>

      {isTraining && <p>Training in progress...</p>}
      {(
        <div className="mt-6">
          <button
            onClick={handleLeaderboardClick}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mr-4"
          >
            Show Leaderboard
          </button>

          <button
            onClick={handleFeatureImportanceClick}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
            Show Feature Importance
          </button>
        </div>
      )}

      {loadingLeaderboard && <p>Loading leaderboard...</p>}
      {showLeaderboard && <Leaderboard leaderboardData={leaderboardData} bestModel={bestModel} />}

      {loadingFeatureImportance && <p>Loading feature importance...</p>}
      {showFeatureImportance && <FeatureImportance data={featureImportanceData} />}
    </div>
  );
}
