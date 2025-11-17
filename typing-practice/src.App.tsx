import { useState, useEffect } from 'react';
import './App.css';
import TypingInput from './components/TypingInput';
import Hint from './components/Hint';
import Stats from './components-Stats';
import ModeSelector, { PracticeMode } from './components/ModeSelector';
import SummaryView from './components/SummaryView';
import useDarkMode from './hooks/useDarkMode';

interface Progress {
  wpm: number;
  accuracy: number;
}

interface StuckPoint {
  character: string;
  attempts: number;
}

function App() {
  useDarkMode(); // Hook to enable automatic dark mode

  const [practiceText, setPracticeText] = useState<string>('正在加载练习文本...');
  const [activeMode, setActiveMode] = useState<PracticeMode>('phrase');
  const [shuangpinHint, setShuangpinHint] = useState<string>('');
  const [heXingHint, setHeXingHint] = useState<string>('');
  const [progress, setProgress] = useState<Progress>({ wpm: 0, accuracy: 100 });
  const [showSummary, setShowSummary] = useState(false);
  const [stuckPoints, setStuckPoints] = useState<StuckPoint[]>([]);

  useEffect(() => {
    generatePracticeText(activeMode);
  }, [activeMode]);

  const generatePracticeText = (mode: PracticeMode) => {
    if (mode === 'phrase') {
      fetch('/poetry.json')
        .then(res => res.json())
        .then((data: string[]) => {
          const randomIndex = Math.floor(Math.random() * data.length);
          setPracticeText(data[randomIndex] || '未能加载文本，请刷新。');
        })
        .catch(() => {
          setPracticeText('练习文本加载失败，请检查文件是否存在。');
        });
    } else if (mode === 'single') {
      setPracticeText('单字练习模式即将推出。');
    } else if (mode === 'targeted') {
      setPracticeText('弱项键位练习模式即将推出。');
    }
    setProgress({ wpm: 0, accuracy: 100 });
    setStuckPoints([]);
    setShowSummary(false);
  };

  const handleError = (char: string) => {
    setStuckPoints(prev => {
      const existing = prev.find(p => p.character === char);
      if (existing) {
        return prev.map(p => p.character === char ? { ...p, attempts: p.attempts + 1 } : p);
      }
      return [...prev, { character: char, attempts: 1 }];
    });
  };

  const handleComplete = () => {
    setShowSummary(true);
  };

  const handleNext = () => {
    generatePracticeText(activeMode);
  };

  const handleModeChange = (mode: PracticeMode) => {
    setActiveMode(mode);
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen font-sans flex flex-col transition-colors duration-300">
      <header className="text-center py-4 border-b dark:border-gray-700">
        <h1 className="text-3xl font-bold">小鹤双拼练习</h1>
        <p className="text-sm text-gray-500">Xiaohe Shuangpin Practice</p>
      </header>
      <main className="container mx-auto p-4 flex-grow flex flex-col justify-center">
        <div className="space-y-6 max-w-4xl mx-auto w-full">
          <ModeSelector currentMode={activeMode} onModeChange={handleModeChange} />
          <TypingInput
            practiceText={practiceText}
            onProgress={setProgress}
            onComplete={handleComplete}
            onError={handleError}
          />
          <Hint shuangpin={shuangpinHint} heXing={heXingHint} />
          <Stats wpm={progress.wpm} accuracy={progress.accuracy} />
        </div>
      </main>
      {showSummary && (
        <SummaryView
          wpm={progress.wpm}
          accuracy={progress.accuracy}
          stuckPoints={stuckPoints}
          onNext={handleNext}
        />
      )}
    </div>
  );
}

export default App;
