import React from 'react';

interface SummaryViewProps {
  wpm: number;
  accuracy: number;
  stuckPoints: { character: string; attempts: number }[];
  onNext: () => void;
}

const SummaryView: React.FC<SummaryViewProps> = ({ wpm, accuracy, stuckPoints, onNext }) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl text-center max-w-md w-full transform transition-all duration-300 scale-95 opacity-0 animate-enter">
        <h2 className="text-2xl font-bold mb-4">练习完成!</h2>
        <div className="flex justify-around mb-6">
          <div className="text-center">
            <p className="text-sm text-gray-500">WPM</p>
            <p className="text-4xl font-bold">{wpm}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Accuracy</p>
            <p className="text-4xl font-bold">{accuracy}%</p>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="font-semibold mb-2">卡壳点 (Stuck Points)</h3>
          <div className="h-32 overflow-y-auto bg-gray-100 dark:bg-gray-700 p-2 rounded">
            {stuckPoints.length > 0 ? (
              <ul className="text-left">
                {stuckPoints.map((p, i) => (
                  <li key={i} className="flex justify-between">
                    <span>'{p.character}'</span>
                    <span>{p.attempts} 次错误</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">无! 完美!</p>
            )}
          </div>
        </div>
        <button
          onClick={onNext}
          className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
        >
          继续练习
        </button>
      </div>
    </div>
  );
};

export default SummaryView;
