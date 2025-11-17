import React, { useState, useRef, useEffect } from 'react';

interface TypingInputProps {
  practiceText: string;
  onProgress: (progress: { wpm: number; accuracy: number }) => void;
  onComplete: () => void;
  onError: (character: string) => void;
}

const TypingInput: React.FC<TypingInputProps> = ({ practiceText, onProgress, onComplete, onError }) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<number | null>(null);
  const errorsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setInputValue('');
    startTimeRef.current = null;
    errorsRef.current = new Set();
  }, [practiceText]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const lastCharIndex = value.length - 1;

    if (startTimeRef.current === null && value.length > 0) {
      startTimeRef.current = Date.now();
    }

    // Check for new errors
    if (lastCharIndex >= 0 && value[lastCharIndex] !== practiceText[lastCharIndex]) {
      if (!errorsRef.current.has(lastCharIndex)) {
        onError(practiceText[lastCharIndex]);
        errorsRef.current.add(lastCharIndex);
      }
    }

    const elapsedTime = startTimeRef.current ? (Date.now() - startTimeRef.current) / 60000 : 0;
    const typedChars = value.length;
    const correctChars = value.split('').filter((char, i) => char === practiceText[i]).length;

    const wpm = elapsedTime > 0 ? Math.round((typedChars / 5) / elapsedTime) : 0;
    const accuracy = typedChars > 0 ? Math.round((correctChars / typedChars) * 100) : 100;

    setInputValue(value);
    onProgress({ wpm, accuracy });

    if (value.length === practiceText.length) {
      onComplete();
    }
  };

  const renderPracticeText = () => {
    return practiceText.split('').map((char, index) => {
      let color = 'text-gray-500 dark:text-gray-400';
      if (index < inputValue.length) {
        color = char === inputValue[index] ? 'text-green-500' : 'text-red-500';
      }
      return <span key={index} className={color}>{char}</span>;
    });
  };

  return (
    <div>
      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-inner mb-4">
        <p className="text-2xl font-mono tracking-widest leading-loose">
          {renderPracticeText()}
        </p>
      </div>
      <input
        ref={inputRef}
        type="text"
        className="w-full p-2 text-lg text-center bg-transparent border-2 border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-blue-500 text-gray-800 dark:text-gray-200"
        value={inputValue}
        onChange={handleChange}
        placeholder="开始打字..."
        autoComplete="off"
        autoCapitalize="none"
        autoCorrect="off"
      />
    </div>
  );
};

export default TypingInput;
