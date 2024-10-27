import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FeatureImportance = ({ data }: any) => {
  console.log(data);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Feature Importance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr>
                <th className="border-b border-gray-300 p-2 text-left">Feature</th>
                <th className="border-b border-gray-300 p-2 text-left">Relative Importance</th>
              </tr>
            </thead>
            <tbody>
              {data.map((feature: any) => (
                <tr key={feature.feature} className="hover:bg-gray-100">
                  <td className="border-b border-gray-300 p-2">{feature.feature}</td>
                  <td className="border-b border-gray-300 p-2">{feature.scaled_importance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureImportance;
