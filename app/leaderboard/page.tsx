'use client';

import { useState } from 'react';
import Leaderboard from '@/components/LeaderBoard';

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
      console.log(data)
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12">
      <h1 className="text-4xl font-bold mb-6">Model Leaderboard</h1>

      <button
        onClick={handleGetLeaderboard}
        className="bg-indigo-500 text-white px-4 py-2 rounded mb-6"
        disabled={loadingLeaderboard}
      >
        {loadingLeaderboard ? 'Fetching Leaderboard...' : 'Show Leaderboard'}
      </button>

      {showLeaderboard && <Leaderboard leaderboardData={leaderboardData} bestModel={bestModel} />}
    </div>
  );
}
