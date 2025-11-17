import React from 'react';

export type PracticeMode = 'targeted' | 'single' | 'phrase';

interface ModeSelectorProps {
  currentMode: PracticeMode;
  onModeChange: (mode: PracticeMode) => void;
}

const MODES: { id: PracticeMode; name: string }[] = [
  { id: 'targeted', name: '弱项键位' }, // Weak Keys
  { id: 'single', name: '单字练习' },   // Single Character
  { id: 'phrase', name: '诗词练习' },   // Phrases/Poems
];

const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onModeChange }) => {
  return (
    <div className="flex justify-center space-x-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
      {MODES.map(mode => (
        <button
          key={mode.id}
          onClick={() => onModeChange(mode.id)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            currentMode === mode.id
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {mode.name}
        </button>
      ))}
    </div>
  );
};

export default ModeSelector;
