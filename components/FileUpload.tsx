import React, { ChangeEvent } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  label: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, label }) => {
  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      onFileSelect(file);
    } else {
      alert('Please upload a valid CSV file.');
    }
  };

  return (
    <div className="mb-6">
      <label className="font-semibold">{label}</label>
      <input type="file" accept=".csv" onChange={handleFileUpload} className="border rounded p-2 mt-1" />
    </div>
  );
};

export default FileUpload;
