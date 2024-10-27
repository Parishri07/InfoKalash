import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table } from "@/components/ui/table";

// Define the type for a model in the leaderboard
interface LeaderboardModel {
  model_id: string;
  logloss: number;
  mse: number;
  rmse: number;
  algorithm?: string; // Optional if not always present
}

// Define the props for the Leaderboard component
interface LeaderboardProps {
  leaderboardData: LeaderboardModel[];
  bestModel?: LeaderboardModel; // Optional bestModel prop
}

const Leaderboard: React.FC<LeaderboardProps> = ({ leaderboardData, bestModel }) => {
  return (
    <div className="mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <thead>
                <tr>
                  <th className="border-b p-2 text-left text-sm font-medium">Model</th>
                  <th className="border-b p-2 text-left text-sm font-medium">Logloss</th>
                  <th className="border-b p-2 text-left text-sm font-medium">MSE</th>
                  <th className="border-b p-2 text-left text-sm font-medium">RMSE</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((model, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border-b p-2 text-sm">{model.model_id}</td>
                    <td className="border-b p-2 text-sm">{model.logloss}</td>
                    <td className="border-b p-2 text-sm">{model.mse}</td>
                    <td className="border-b p-2 text-sm">{model.rmse}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          {bestModel && (
            <p className="mt-4 text-center text-md">
              Best Model: <strong>{bestModel.model_id}</strong> with algorithm: <strong>{bestModel.algorithm}</strong>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;
