import React from 'react';
import { HistoryItem } from '../types';

interface HistoryPageProps {
  history: HistoryItem[];
  onSelectItem: (text: string) => void;
  onBack: () => void;
}

const HistoryPage: React.FC<HistoryPageProps> = ({ history, onSelectItem, onBack }) => {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Show relative time for recent items
    if (diffDays === 0) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `今天 ${hours}:${minutes}`;
    } else if (diffDays === 1) {
      return '昨天';
    } else if (diffDays < 7) {
      return `${diffDays} 天前`;
    } else {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${month}/${day}`;
    }
  };

  const getDisplayText = (text: string) => {
    return text.length > 40 ? text.substring(0, 40) + '...' : text;
  };

  return (
    <div className="container active">
      {/* Organic Blur Shapes */}
      <div 
        className="blur-shape blur-shape-secondary" 
        style={{ 
          width: '220px', 
          height: '220px', 
          top: '50px', 
          right: '-80px',
          opacity: 0.1
        }}
        aria-hidden="true"
      />
      <div 
        className="blur-shape blur-shape-primary" 
        style={{ 
          width: '160px', 
          height: '160px', 
          bottom: '20px', 
          left: '-60px',
          opacity: 0.08
        }}
        aria-hidden="true"
      />

      <header>
        <button 
          className="back-btn" 
          onClick={onBack}
          aria-label="返回主页"
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          返回
        </button>
        <h1 className="title-large">历史记录</h1>
      </header>

      <div className="card" style={{ padding: history.length === 0 ? '0' : '12px' }}>
        {history.length === 0 ? (
          <div className="empty-state">
            暂无历史记录
            <p 
              style={{ 
                fontSize: '0.875rem', 
                marginTop: '8px',
                opacity: 0.7
              }}
            >
              生成的二维码将显示在这里
            </p>
          </div>
        ) : (
          <div 
            className="history-list"
            role="list"
            aria-label="历史记录列表"
          >
            {history.map((item, index) => (
              <div
                key={`${item.timestamp}-${index}`}
                className="history-item"
                onClick={() => onSelectItem(item.text)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelectItem(item.text);
                  }
                }}
                aria-label={`生成 ${getDisplayText(item.text)} 的二维码`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Icon */}
                  <div 
                    className="history-icon"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--md-primary-container)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'var(--transition-fast)'
                    }}
                  >
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="var(--md-on-primary-container)"
                      aria-hidden="true"
                    >
                      <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm8-2v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm13-2h3v2h-3v-2zm-3 0h2v2h-2v-2zm2 3h2v2h-2v-2zm1 1h2v2h-2v-2zm1-4h2v2h-2v-2zm0 3h2v2h-2v-2zm1 3h2v2h-2v-2z"/>
                    </svg>
                  </div>
                  
                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="history-text">
                      {getDisplayText(item.text)}
                    </div>
                    <div className="history-time">
                      {formatTime(item.timestamp)}
                    </div>
                  </div>

                  {/* Arrow */}
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="var(--md-on-surface-variant)"
                    style={{
                      opacity: 0.5,
                      transition: 'var(--transition-fast)'
                    }}
                    className="history-arrow"
                    aria-hidden="true"
                  >
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Clear History Button (if has items) */}
      {history.length > 0 && (
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <button
            className="btn btn-text"
            onClick={() => {
              if (confirm('确定要清空所有历史记录吗？')) {
                chrome.storage.local.remove(['history']);
                window.location.reload();
              }
            }}
            style={{ 
              color: 'var(--md-error)',
              fontSize: '0.875rem'
            }}
            aria-label="清空历史记录"
          >
            清空历史记录
          </button>
        </div>
      )}

    </div>
  );
};

export default HistoryPage;