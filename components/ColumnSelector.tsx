import React from 'react';

interface ColumnSelectorProps {
  columns: string[];
  selectedColumns: string[];
  targetColumn: string;
  onTargetSelect: (column: string) => void;
  onFeatureSelect: (column: string) => void;
}

const ColumnSelector: React.FC<ColumnSelectorProps> = ({
  columns,
  selectedColumns,
  targetColumn,
  onTargetSelect,
  onFeatureSelect,
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold mb-2">Select Target Column</h2>
      <select onChange={(e) => onTargetSelect(e.target.value)} value={targetColumn} className="border rounded p-2">
        <option value="">Select Target Column</option>
        {columns.map((col) => (
          <option key={col} value={col}>
            {col}
          </option>
        ))}
      </select>

      <h2 className="text-2xl font-semibold mb-2 mt-4">Select Feature Columns</h2>
      {columns.map((col) => (
        <div key={col}>
          <label>
            <input
              type="checkbox"
              checked={selectedColumns.includes(col)}
              onChange={() => onFeatureSelect(col)}
            />
            {col}
          </label>
        </div>
      ))}
    </div>
  );
};

export default ColumnSelector;
