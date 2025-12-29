const MAX_LENGTH = 800;
const HISTORY_LIMIT = 20;

interface HistoryItem {
  text: string;
  timestamp: number;
}

// Initialize context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "generateQRCode",
    title: "生成二维码",
    contexts: ["selection"]
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "generateQRCode" && info.selectionText) {
    const selectedText = info.selectionText;

    if (selectedText.length > MAX_LENGTH) {
      chrome.storage.local.set({
        qrText: null,
        error: `选中的文字超过${MAX_LENGTH}个字符限制（当前：${selectedText.length}个字符）`
      }, () => {
        chrome.action.openPopup();
      });
    } else {
      chrome.storage.local.set({
        qrText: selectedText,
        error: null
      }, () => {
        saveToHistory(selectedText);
        chrome.action.openPopup();
      });
    }
  }
});

// Save to history
function saveToHistory(text: string): void {
  chrome.storage.local.get(['history'], (result) => {
    let history: HistoryItem[] = result.history || [];
    
    // Remove existing item if present
    const existingIndex = history.findIndex(item => item.text === text);
    if (existingIndex !== -1) {
      history.splice(existingIndex, 1);
    }
    
    // Add new item at the beginning
    history.unshift({
      text: text,
      timestamp: Date.now()
    });
    
    // Keep only last 20 items
    if (history.length > HISTORY_LIMIT) {
      history = history.slice(0, HISTORY_LIMIT);
    }
    
    chrome.storage.local.set({ history: history });
  });
}

export {};