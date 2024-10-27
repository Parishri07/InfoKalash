'use client';

import { useState } from 'react';
import FeatureImportance from '@/components/FeatureImportance'; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12">
      <Card className="max-w-3xl w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Feature Importance Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleFeatureImportanceClick} 
            className="mb-4 w-full"
            disabled={loadingFeatureImportance}
          >
            {loadingFeatureImportance ? 'Loading...' : 'Fetch Feature Importance'}
          </Button>

          {showFeatureImportance && <FeatureImportance data={featureImportanceData} />}
        </CardContent>
      </Card>
    </div>
  );
}
