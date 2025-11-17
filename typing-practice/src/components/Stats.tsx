import React from 'react';

interface StatsProps {
  wpm: number;
  accuracy: number;
}

const Stats: React.FC<StatsProps> = ({ wpm, accuracy }) => {
  return (
    <div className="flex justify-around p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mt-4">
      <div className="text-center">
        <p className="text-sm text-gray-500">WPM</p>
        <p className="text-3xl font-bold">{wpm}</p>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-500">Accuracy</p>
        <p className="text-3xl font-bold">{accuracy}%</p>
      </div>
    </div>
  );
};

export default Stats;
