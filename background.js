const MAX_LENGTH = 512;

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "generateQRCode",
    title: "生成二维码",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "generateQRCode") {
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
        chrome.action.openPopup();
      });
    }
  }
});
