import React from 'react';

const Leaderboard = ({ leaderboardData, bestModel } : any) => {
  return (
    <div className="mt-6 w-full  mx-auto px-2">
      <h2 className="text-xl font-semibold mb-4 text-center">Leaderboard</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 text-left text-sm w-1/3">Model</th>
              <th className="border border-gray-300 p-2 text-left text-sm w-1/4">Logloss</th>
              <th className="border border-gray-300 p-2 text-left text-sm w-1/4">MSE</th>
              <th className="border border-gray-300 p-2 text-left text-sm w-1/4">RMSE</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((model, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-2 text-sm">{model.model_id}</td>
                <td className="border border-gray-300 p-2 text-sm">{model.logloss}</td>
                <td className="border border-gray-300 p-2 text-sm">{model.mse}</td>
                <td className="border border-gray-300 p-2 text-sm">{model.rmse}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {bestModel && (
        <p className="mt-4 text-center text-md">
          Best Model: <strong>{bestModel.model_id}</strong> with algorithm: <strong>{bestModel.algorithm}</strong>
        </p>
      )}
    </div>
  );
};

export default Leaderboard;
