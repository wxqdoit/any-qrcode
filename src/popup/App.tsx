import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import QRCodePage from './components/QRCodePage';
import HistoryPage from './components/HistoryPage';
import { HistoryItem } from './types';

export type PageType = 'home' | 'qrcode' | 'history';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [qrText, setQrText] = useState<string>('');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    // Load history from storage
    chrome.storage.local.get(['history'], (result) => {
      if (result.history) {
        setHistory(result.history);
      }
    });

    // Check for selected text from context menu
    chrome.storage.local.get(['qrText', 'error'], (result) => {
      if (result.error) {
        alert(result.error);
        chrome.storage.local.remove(['qrText', 'error']);
        return;
      }

      if (result.qrText) {
        generateQRCode(result.qrText);
        chrome.storage.local.remove(['qrText', 'error']);
      }
    });
  }, []);

  const generateQRCode = (text: string) => {
    if (!text || text.length > 800) {
      if (text && text.length > 800) {
        alert(`文本超过800个字符限制（当前：${text.length}个字符）`);
      }
      return;
    }

    setQrText(text);
    saveToHistory(text);
    setCurrentPage('qrcode');
  };

  const saveToHistory = (text: string) => {
    chrome.storage.local.get(['history'], (result) => {
      let historyItems: HistoryItem[] = result.history || [];

      // Remove existing item if present
      const existingIndex = historyItems.findIndex(item => item.text === text);
      if (existingIndex !== -1) {
        historyItems.splice(existingIndex, 1);
      }

      // Add new item at the beginning
      historyItems.unshift({
        text: text,
        timestamp: Date.now()
      });

      // Keep only last 20 items
      if (historyItems.length > 20) {
        historyItems = historyItems.slice(0, 20);
      }

      chrome.storage.local.set({ history: historyItems });
      setHistory(historyItems);
    });
  };

  return (
    <div className="app">
      {currentPage === 'home' && (
        <HomePage
          onGenerateQR={generateQRCode}
          onNavigateToHistory={() => setCurrentPage('history')}
        />
      )}
      {currentPage === 'qrcode' && (
        <QRCodePage
          text={qrText}
          onBack={() => setCurrentPage('home')}
        />
      )}
      {currentPage === 'history' && (
        <HistoryPage
          history={history}
          onSelectItem={generateQRCode}
          onBack={() => setCurrentPage('home')}
        />
      )}
    </div>
  );
};

export default App;