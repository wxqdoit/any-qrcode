const MAX_LENGTH = 800;  // QR码实际容量限制
const HISTORY_LIMIT = 20;

let currentPage = 'home';
let qrcodeInstance = null;

function switchPage(page) {
  document.querySelectorAll('.container').forEach(el => el.classList.remove('active'));
  document.getElementById(`${page}-page`).classList.add('active');
  currentPage = page;
}

function generateQRCode(text) {
  if (!text || text.length > MAX_LENGTH) {
    if (text && text.length > MAX_LENGTH) {
      alert(`文本超过${MAX_LENGTH}个字符限制（当前：${text.length}个字符）`);
    }
    return;
  }

  const qrcodeContainer = document.getElementById('qrcode');
  const textPreview = document.getElementById('text-preview');

  qrcodeContainer.innerHTML = '';

  // 根据文本长度动态调整二维码大小和纠错级别
  let size = 200;
  let correctLevel = QRCode.CorrectLevel.L;  // 统一使用低纠错级别以支持更多数据
  let typeNumber = 0;

  // 根据实际字节长度（UTF-8）计算
  const byteLength = new TextEncoder().encode(text).length;
  
  if (byteLength > 600) {
    size = 280;
    typeNumber = 40;  // 使用最大版本
  } else if (byteLength > 400) {
    size = 256;
    typeNumber = 35;
  } else if (byteLength > 200) {
    size = 230;
    typeNumber = 25;
  } else {
    typeNumber = 15;
  }

  try {
    qrcodeInstance = new QRCode(qrcodeContainer, {
      text: text,
      width: size,
      height: size,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: correctLevel,
      typeNumber: typeNumber,  // 根据文本长度设置版本
      useSVG: false
    });

    const previewText = text.length > 50 ? text.substring(0, 50) + "..." : text;
    textPreview.textContent = previewText;

    saveToHistory(text);

    switchPage('qrcode');
  } catch (error) {
    console.error('QR Code generation failed:', error);
    const byteLength = new TextEncoder().encode(text).length;
    qrcodeContainer.innerHTML = `<div class="error">生成二维码失败：文本过长<br>当前长度：${text.length}字符 (${byteLength}字节)<br>建议减少文字或使用链接</div>`;
    switchPage('qrcode');
  }
}

function saveToHistory(text) {
  chrome.storage.local.get(['history'], (result) => {
    let history = result.history || [];

    const existingIndex = history.findIndex(item => item.text === text);
    if (existingIndex !== -1) {
      history.splice(existingIndex, 1);
    }

    history.unshift({
      text: text,
      timestamp: Date.now()
    });

    if (history.length > HISTORY_LIMIT) {
      history = history.slice(0, HISTORY_LIMIT);
    }

    chrome.storage.local.set({ history: history });
  });
}

function loadHistory() {
  chrome.storage.local.get(['history'], (result) => {
    const historyList = document.getElementById('history-list');
    const history = result.history || [];

    if (history.length === 0) {
      historyList.innerHTML = '<div class="empty-state">暂无历史记录</div>';
      return;
    }

    historyList.innerHTML = history.map(item => {
      const date = new Date(item.timestamp);
      const timeStr = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      const displayText = item.text.length > 40 ? item.text.substring(0, 40) + '...' : item.text;

      return `
        <div class="history-item" data-text="${item.text.replace(/"/g, '&quot;')}">
          <div class="history-text">${displayText}</div>
          <div class="history-time">${timeStr}</div>
        </div>
      `;
    }).join('');

    document.querySelectorAll('.history-item').forEach(item => {
      item.addEventListener('click', () => {
        const text = item.getAttribute('data-text').replace(/&quot;/g, '"');
        generateQRCode(text);
      });
    });
  });
}

function checkForSelectedText() {
  chrome.storage.local.get(['qrText', 'error'], (result) => {
    if (result.error) {
      alert(result.error);
      chrome.storage.local.remove(['qrText', 'error']);
      return;
    }

    if (result.qrText) {
      // 直接生成二维码并显示，不显示主页
      generateQRCode(result.qrText);
      chrome.storage.local.remove(['qrText', 'error']);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  checkForSelectedText();

  document.getElementById('generate-btn').addEventListener('click', () => {
    const text = document.getElementById('text-input').value.trim();
    generateQRCode(text);
  });

  document.getElementById('clear-btn').addEventListener('click', () => {
    document.getElementById('text-input').value = '';
  });

  document.getElementById('history-btn').addEventListener('click', () => {
    loadHistory();
    switchPage('history');
  });

  document.getElementById('back-from-qr').addEventListener('click', () => {
    switchPage('home');
  });

  document.getElementById('back-from-history').addEventListener('click', () => {
    switchPage('home');
  });

  document.getElementById('text-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      const text = e.target.value.trim();
      generateQRCode(text);
    }
  });

  document.getElementById('text-input').addEventListener('paste', (e) => {
    setTimeout(() => {
      const input = e.target;
      if (input.value.length > MAX_LENGTH) {
        input.value = input.value.substring(0, MAX_LENGTH);
        alert(`文本已截断至${MAX_LENGTH}个字符`);
      }
    }, 10);
  });
});