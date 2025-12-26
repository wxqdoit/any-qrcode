document.addEventListener("DOMContentLoaded", () => {
  const qrcodeContainer = document.getElementById("qrcode");
  const textPreview = document.getElementById("text-preview");

  chrome.storage.local.get(["qrText", "error"], (result) => {
    if (result.error) {
      qrcodeContainer.innerHTML = `<div class="error">${result.error}</div>`;
      return;
    }

    if (result.qrText) {
      new QRCode(qrcodeContainer, {
        text: result.qrText,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M
      });

      const previewText = result.qrText.length > 50
        ? result.qrText.substring(0, 50) + "..."
        : result.qrText;
      textPreview.textContent = previewText;
    } else {
      qrcodeContainer.innerHTML = `<div class="hint">请在网页中选择文字，右键点击"生成二维码"</div>`;
    }
  });
});
