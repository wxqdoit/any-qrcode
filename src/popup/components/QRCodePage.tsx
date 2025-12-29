import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodePageProps {
  text: string;
  onBack: () => void;
}

const QRCodePage: React.FC<QRCodePageProps> = ({ text, onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!text) return;

    const generateQR = async () => {
      try {
        if (canvasRef.current) {
          // Calculate parameters based on text length
          const byteLength = new TextEncoder().encode(text).length;
          let size = 200;
          
          if (byteLength > 600) {
            size = 280;
          } else if (byteLength > 400) {
            size = 256;
          } else if (byteLength > 200) {
            size = 230;
          }

          await QRCode.toCanvas(canvasRef.current, text, {
            width: size,
            margin: 2,
            errorCorrectionLevel: 'L',
            color: {
              dark: '#000000',
              light: '#ffffff'
            }
          });
        }
      } catch (err) {
        const byteLength = new TextEncoder().encode(text).length;
        setError(`生成二维码失败：文本过长
当前长度：${text.length}字符 (${byteLength}字节)
建议减少文字或使用链接`);
        console.error('QR Code generation failed:', err);
      }
    };

    generateQR();
  }, [text]);

  const previewText = text.length > 50 ? text.substring(0, 50) + '...' : text;

  return (
    <div className="container active">
      <header>
        <button className="back-btn" onClick={onBack}>
          ← 返回
        </button>
        <h1>二维码</h1>
      </header>

      <div className="card">
        <div id="qrcode">
          {error ? (
            <div className="error" dangerouslySetInnerHTML={{ __html: error }} />
          ) : (
            <canvas ref={canvasRef} />
          )}
        </div>
        {!error && <div className="text-preview">{previewText}</div>}
      </div>
    </div>
  );
};

export default QRCodePage;