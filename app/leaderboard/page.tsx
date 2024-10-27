'use client';

import { useState } from 'react';
import Leaderboard from '@/components/LeaderBoard';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [bestModel, setBestModel] = useState<any>(null);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState<boolean>(false);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);

  const handleGetLeaderboard = async () => {
    setLoadingLeaderboard(true);
    try {
      const res = await fetch('/api/leaderboard', { method: 'GET' });
      if (!res.ok) {
        const errorText = await res.text();
        alert(`Error: ${errorText}`);
        setLoadingLeaderboard(false);
        return;
      }
      const data = await res.json();
      setLeaderboardData(data.models);
      setBestModel(data.best_model);
      setShowLeaderboard(true);
    } catch (error) {
      console.error('Error fetching the leaderboard:', error);
      alert('An error occurred while fetching the leaderboard');
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12">
      <Card className="max-w-3xl w-full">
        <CardHeader>
          <CardTitle className="text-4xl font-bold">Model Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleGetLeaderboard}
            className="w-full mb-6"
            disabled={loadingLeaderboard}
          >
            {loadingLeaderboard ? 'Fetching Leaderboard...' : 'Show Leaderboard'}
          </Button>

          {showLeaderboard && <Leaderboard leaderboardData={leaderboardData} bestModel={bestModel} />}
        </CardContent>
      </Card>
    </div>
  );
}
