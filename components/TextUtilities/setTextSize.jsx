import React from 'react';
import { textServices } from '../../services/textServices';

export default function SetTextSize() {
  const fontSizes = ['12px', '16px', '20px', '24px', '28px', '32px'];

  const handleSizeChange = (size) => {
    textServices.applyStyleToSelection({ fontSize: size });
  };

  return (
    <div className="text-size-controls p-4 bg-gray-900 text-white rounded-lg shadow-lg">
      <select
        onChange={(e) => handleSizeChange(e.target.value)}
        className="bg-gray-700 text-white p-2 rounded-md border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
      >
        {fontSizes.map((size) => (
          <option key={size} value={size} className="bg-gray-800 text-white">
            {size}
          </option>
        ))}
      </select>
    </div>
  );
}
