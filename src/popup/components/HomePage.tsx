import React, { useState } from 'react';

interface HomePageProps {
  onGenerateQR: (text: string) => void;
  onNavigateToHistory: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onGenerateQR, onNavigateToHistory }) => {
  const [inputText, setInputText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

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
      {/* Organic Blur Shapes */}
      <div 
        className="blur-shape blur-shape-primary" 
        style={{ 
          width: '200px', 
          height: '200px', 
          top: '-50px', 
          right: '-50px' 
        }}
        aria-hidden="true"
      />
      <div 
        className="blur-shape blur-shape-secondary" 
        style={{ 
          width: '150px', 
          height: '150px', 
          bottom: '100px', 
          left: '-30px' 
        }}
        aria-hidden="true"
      />
      <div 
        className="blur-shape blur-shape-tertiary" 
        style={{ 
          width: '100px', 
          height: '100px', 
          top: '50%', 
          right: '20px',
          transform: 'translateY(-50%)'
        }}
        aria-hidden="true"
      />

      <header>
        <h1 className="title-large">Any QRCode</h1>
        <button 
          className="nav-btn" 
          onClick={onNavigateToHistory}
          aria-label="查看历史记录"
        >
          历史记录
        </button>
      </header>

      <div className="card">
        <div className="text-field">
          <label 
            className={`text-field-label ${isFocused ? 'focused' : ''}`}
            htmlFor="text-input"
          >
            输入或粘贴文本
          </label>
          <textarea
            id="text-input"
            className="text-field-input"
            placeholder="请输入要生成二维码的文本（最多800字符）..."
            maxLength={800}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            aria-label="输入文本"
            aria-describedby="text-counter"
          />
          <div 
            id="text-counter"
            className="label-medium" 
            style={{ 
              textAlign: 'right', 
              marginTop: '4px',
              color: inputText.length > 700 ? 'var(--md-error)' : 'var(--md-on-surface-variant)',
              transition: 'var(--transition-fast)'
            }}
          >
            {inputText.length}/800
          </div>
        </div>

        <div className="button-group">
          <button 
            className="btn btn-filled" 
            onClick={handleGenerate}
            disabled={!inputText.trim()}
            aria-label="生成二维码"
          >
            生成二维码
          </button>
          <button 
            className="btn btn-tonal" 
            onClick={handleClear}
            disabled={!inputText}
            aria-label="清空输入"
          >
            清空
          </button>
        </div>
      </div>

      {/* Feature Tips */}
      <div 
        style={{
          marginTop: '16px',
          padding: '12px 16px',
          background: 'var(--md-tertiary-container)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.875rem',
          color: 'var(--md-on-tertiary-container)',
          textAlign: 'center',
          opacity: 0.9
        }}
      >
        💡 提示：按 Ctrl+Enter 快速生成二维码
      </div>
    </div>
  );
};

export default HomePage;