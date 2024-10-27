'use client';

import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UploadPageProps {}

const UploadPage: React.FC<UploadPageProps> = () => {
  const [file, setFile] = useState<File | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [targetColumn, setTargetColumn] = useState<string>('');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<string[][]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [trainingComplete, setTrainingComplete] = useState<boolean>(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
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

  const parseCSV = async (file: File): Promise<void> => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').map(line => line.split(',').map(col => col.trim()));
      const firstLine = lines[0];
      setColumns(firstLine);
      setPreviewData(lines.slice(0, 5)); // Display first 5 rows for preview
    };
    reader.readAsText(file);
  };

  const handleColumnSelection = (col: string): void => {
    setSelectedColumns((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  const handleSubmit = async (): Promise<void> => {
    if (!file || !targetColumn || selectedColumns.length === 0) {
      setError('Please select a file, target column, and feature columns');
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
        setError(errorText);
        return;
      }
      setIsTraining(true);
      pollTrainingStatus();
    } catch (error) {
      console.error('Error submitting the form:', error);
      setError('An error occurred while submitting the form');
    }
  };

  const pollTrainingStatus = (): void => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/training_status');
        const status = await res.json();

        if (!status.is_training) {
          setTrainingComplete(true);
          setIsTraining(false);
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Error checking training status:', error);
      }
    }, 10000);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Model Training Dashboard</h1>
            <p className="text-muted-foreground mt-2">Upload your CSV data and configure model training parameters</p>
          </div>
          {trainingComplete && (
            <Alert className="w-fit bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">Model training completed successfully</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Data Upload</CardTitle>
              <CardDescription>Select your CSV file to begin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full place-items-center gap-4 rounded-lg border border-dashed p-8">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>

          {columns.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Column Selection</CardTitle>
                <CardDescription>Choose target and feature columns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Column</label>
                  <Select value={targetColumn} onValueChange={setTargetColumn}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select target column" />
                    </SelectTrigger>
                    <SelectContent>
                      {columns.map((col) => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Feature Columns</label>
                  <div className="grid grid-cols-2 gap-4">
                    {columns.map((col) => (
                      <div key={col} className="flex items-center space-x-2">
                        <Checkbox 
                          id={col}
                          checked={selectedColumns.includes(col)}
                          onCheckedChange={() => handleColumnSelection(col)}
                        />
                        <label htmlFor={col} className="text-sm">{col}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {previewData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Data Preview</CardTitle>
              <CardDescription>First 5 rows of your dataset</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-slate-50">
                      {previewData[0].map((col: string, idx: number) => (
                        <th key={idx} className="border-b px-4 py-2 text-left text-sm font-medium">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.slice(1).map((row, rowIndex) => (
                      <tr key={rowIndex} className="bg-white">
                        {row.map((col, colIndex) => (
                          <td key={colIndex} className="border-b px-4 py-2 text-sm text-gray-700">
                            {col}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={isTraining}
            className="w-32"
          >
            {isTraining ? (
              <>
                <Progress value={33} className="w-full" />
                Training...
              </>
            ) : (
              'Train Model'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
