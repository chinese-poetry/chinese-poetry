import React from 'react';

interface HintProps {
  shuangpin: string;
  heXing: string;
}

const Hint: React.FC<HintProps> = ({ shuangpin, heXing }) => {
  return (
    <div className="flex justify-center space-x-8 mt-4">
      <div className="text-center">
        <p className="text-sm text-gray-500">双拼 (Shuangpin)</p>
        <p className="text-xl font-semibold">{shuangpin || '—'}</p>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-500">鹤形 (He Xing)</p>
        <p className="text-xl font-semibold">{heXing || '—'}</p>
      </div>
    </div>
  );
};

export default Hint;
