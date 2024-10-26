'use client';

import { useState, useEffect } from 'react';
import Leaderboard from '@/components/LeaderBoard';
import FeatureImportance from '@/components/FeatureImportance'; // Import the new FeatureImportance component

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [testFile, setTestFile] = useState<File | null>(null); // New state for the test file
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
  const [featureImportanceData, setFeatureImportanceData] = useState<any[]>([]);
  const [showFeatureImportance, setShowFeatureImportance] = useState<boolean>(false);
  const [loadingFeatureImportance, setLoadingFeatureImportance] = useState<boolean>(false);

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
    setLoadingPreview(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').map(line => line.split(',').map(col => col.trim()));
      const firstLine = lines[0];
      setColumns(firstLine);
      setPreviewData(lines.slice(0, 5));
      setLoadingPreview(false);
    };
    reader.readAsText(file);
  };

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

  const handleSubmit = async () => {
    if (!file || !targetColumn || selectedColumns.length === 0) {
      alert('Please select a file, target column, and feature columns');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_column', targetColumn.trim());
    // Send the selected columns as a JSON string
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

  const handleTestFileSubmit = async () => {
    if (!testFile) {
      alert('Please upload a test file');
      return;
    }

    const formData = new FormData();
    formData.append('file', testFile);

    try {
      const res = await fetch('/api/upload_test_csv', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error:', errorText);
        alert(`Error: ${errorText}`);
        return;
      }

      const result = await res.json();
      console.log('Test upload results:', result); 
      
      // Download JSON file after successful upload
      const jsonString = JSON.stringify(result, null, 2); // Convert to JSON string
      const blob = new Blob([jsonString], { type: 'application/json' }); // Create a Blob
      const url = URL.createObjectURL(blob); // Create a URL for the Blob

      // Create a temporary anchor element to download the file
      const a = document.createElement('a');
      a.href = url;
      a.download = 'test_upload_results.json'; // Specify the file name
      document.body.appendChild(a); // Append anchor to body
      a.click(); // Trigger the download
      document.body.removeChild(a); // Remove the anchor from the document
      URL.revokeObjectURL(url); // Revoke the Blob URL
    } catch (error) {
      console.error('Error submitting the test file:', error);
      alert('An error occurred while submitting the test file');
    }
  };

  const handleColumnSelection = (col: string) => {
    setSelectedColumns((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  const resetForm = () => {
    setFile(null);
    setTestFile(null); // Reset test file state
    setColumns([]);
    setTargetColumn('');
    setSelectedColumns([]);
    setPreviewData([]);
    setError(null);
    setTrainingComplete(false);
    setShowLeaderboard(false);
    setShowFeatureImportance(false);
  };

  const handleLeaderboardClick = async () => {
    setLoadingLeaderboard(true);
    try {
      const res = await fetch('/api/leaderboard', { method: 'GET' });

      if (!res.ok) {
        throw new Error('Failed to fetch leaderboard data');
      }

      const data = await res.json();
      // console.log(data.models);
      setLeaderboardData(data.models);
      setBestModel(data.best_model);
      setShowLeaderboard(true);
      console.log(leaderboardData)
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      alert('An error occurred while fetching leaderboard data');
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  const handleFeatureImportanceClick = async () => {
    setLoadingFeatureImportance(true);
    try {
      const res = await fetch('/api/feature_importance', { method: 'GET' });

      if (!res.ok) {
        throw new Error('Failed to fetch feature importance data');
      }

      const data = await res.json();
      console.log(data);
      setFeatureImportanceData(data.feature_importance);
      setShowFeatureImportance(true);
    } catch (error) {
      console.error('Error fetching feature importance data:', error);
      alert('An error occurred while fetching feature importance data');
    } finally {
      setLoadingFeatureImportance(false);
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
          {columns.map((col) => (
            <div key={col}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedColumns.includes(col)}
                  onChange={() => handleColumnSelection(col)}
                />
                {col}
              </label>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white rounded px-4 py-2"
      >
        Submit
      </button>

      {isTraining && <p className="mt-4">Training in progress...</p>}
      {trainingComplete && (
        <>
          <h2 className="text-2xl font-semibold mt-6">Upload Test CSV</h2>
          <input
            type="file"
            accept=".csv"
            onChange={handleTestFileUpload}
            className="border rounded p-2 mb-4"
          />
          <button
            onClick={handleTestFileSubmit}
            className="bg-blue-500 text-white rounded px-4 py-2"
          >
            Submit Test File
          </button>

          <button
            onClick={handleLeaderboardClick}
            className="bg-green-500 text-white rounded px-4 py-2 mt-4"
          >
            Show Leaderboard
          </button>
          <button
            onClick={handleFeatureImportanceClick}
            className="bg-purple-500 text-white rounded px-4 py-2 mt-4"
          >
            Show Feature Importance
          </button>
        </>
      )}

      {loadingLeaderboard && <p>Loading leaderboard...</p>}
      {showLeaderboard && <Leaderboard leaderboardData={leaderboardData} bestModel={bestModel} />}

      {loadingFeatureImportance && <p>Loading feature importance...</p>}
      {showFeatureImportance && <FeatureImportance data={featureImportanceData} />}
    </div>
  );
}
