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
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}/${day} ${hours}:${minutes}`;
  };

  const getDisplayText = (text: string) => {
    return text.length > 40 ? text.substring(0, 40) + '...' : text;
  };

  return (
    <div className="container active">
      <header>
        <button className="back-btn" onClick={onBack}>
          ← 返回
        </button>
        <h1>历史记录</h1>
      </header>

      <div className="card">
        <div id="history-list">
          {history.length === 0 ? (
            <div className="empty-state">暂无历史记录</div>
          ) : (
            history.map((item, index) => (
              <div
                key={index}
                className="history-item"
                onClick={() => onSelectItem(item.text)}
              >
                <div className="history-text">{getDisplayText(item.text)}</div>
                <div className="history-time">{formatTime(item.timestamp)}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;