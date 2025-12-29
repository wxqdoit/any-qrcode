import React, { useState } from 'react';

interface HomePageProps {
  onGenerateQR: (text: string) => void;
  onNavigateToHistory: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onGenerateQR, onNavigateToHistory }) => {
  const [inputText, setInputText] = useState('');

  const handleGenerate = () => {
    const text = inputText.trim();
    if (text) {
      onGenerateQR(text);
    }
  };

  const handleClear = () => {
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleGenerate();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    setTimeout(() => {
      const value = e.currentTarget.value;
      if (value.length > 800) {
        setInputText(value.substring(0, 800));
        alert('文本已截断至800个字符');
      }
    }, 10);
  };

  return (
    <div className="container active">
      <header>
        <h1>Any QRCode</h1>
        <button className="nav-btn" onClick={onNavigateToHistory}>
          历史记录
        </button>
      </header>

      <div className="card">
        <div className="input-section">
          <label className="input-label">输入或粘贴文本</label>
          <textarea
            className="text-input"
            placeholder="请输入要生成二维码的文本（最多800字符）..."
            maxLength={800}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
          />
        </div>

        <div className="button-group">
          <button className="btn btn-primary" onClick={handleGenerate}>
            生成二维码
          </button>
          <button className="btn btn-secondary" onClick={handleClear}>
            清空
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;