'use client';

import { useState } from 'react';
import FeatureImportance from '@/components/FeatureImportance'; 

export default function FeatureImportancePage() {
  const [featureImportanceData, setFeatureImportanceData] = useState<any[]>([]);
  const [showFeatureImportance, setShowFeatureImportance] = useState<boolean>(false);
  const [loadingFeatureImportance, setLoadingFeatureImportance] = useState<boolean>(false);

  const handleFeatureImportanceClick = async () => {
    setLoadingFeatureImportance(true);
    try {
      const res = await fetch('/api/feature_importance', { method: 'GET' });
      if (!res.ok) {
        throw new Error('Failed to fetch feature importance data');
      }
      const data = await res.json();
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
      <h1 className="text-2xl font-bold mb-4">Feature Importance Analysis</h1>
      <button 
        onClick={handleFeatureImportanceClick} 
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
        disabled={loadingFeatureImportance}
      >
        {loadingFeatureImportance ? 'Loading...' : 'Fetch Feature Importance'}
      </button>

      {showFeatureImportance && <FeatureImportance data={featureImportanceData} />}
    </div>
  );
}
