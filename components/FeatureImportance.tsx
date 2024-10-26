import React from 'react';

const FeatureImportance = ({ data } : any) => {
    {console.log(data)}
  return (
    <div className="mt-6 p-4 border rounded shadow-lg bg-white">
      <h2 className="text-xl font-semibold mb-2">Feature Importance</h2>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Feature</th>
            <th className="border border-gray-300 p-2">Relative Importance</th>
          </tr>
        </thead>
        <tbody>
          {data.map((feature : any) => (
            <tr key={feature.feature}>
              <td className="border border-gray-300 p-2">{feature.feature}</td>
              <td className="border border-gray-300 p-2">{feature.scaled_importance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeatureImportance;
