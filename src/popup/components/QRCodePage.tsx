import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodePageProps {
  text: string;
  onBack: () => void;
}

const QRCodePage: React.FC<QRCodePageProps> = ({ text, onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    if (!text) return;

    const generateQR = async () => {
      setIsGenerating(true);
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
          setIsGenerating(false);
        }
      } catch (err) {
        const byteLength = new TextEncoder().encode(text).length;
        setError(`Failed to generate QR code: text too long
Current length: ${text.length} characters (${byteLength} bytes)
Consider reducing text or using a link`);
        setIsGenerating(false);
        console.error('QR Code generation failed:', err);
      }
    };

    generateQR();
  }, [text]);

  const previewText = text.length > 50 ? text.substring(0, 50) + '...' : text;

  return (
    <div className="container active">
      {/* Organic Blur Shapes with Animation */}
      <div 
        className="blur-shape blur-shape-primary floating" 
        style={{ 
          width: '250px', 
          height: '250px', 
          top: '-100px', 
          left: '-100px'
        }}
        aria-hidden="true"
      />
      <div 
        className="blur-shape blur-shape-tertiary floating-delayed" 
        style={{ 
          width: '180px', 
          height: '180px', 
          bottom: '-50px', 
          right: '-50px'
        }}
        aria-hidden="true"
      />


      <header>
        <button 
          className="back-btn" 
          onClick={onBack}
          aria-label="Return to home"
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
          Back
        </button>
        <h1 className="title-large">QR Code</h1>
      </header>

      <div className="card" style={{ padding: '24px' }}>
        {error ? (
          <div className="error" dangerouslySetInnerHTML={{ __html: error }} />
        ) : (
          <>
            <div id="qrcode" className={isGenerating ? 'loading' : ''}>
              <canvas 
                ref={canvasRef}
                style={{
                  display: isGenerating ? 'none' : 'block'
                }}
              />
              {isGenerating && (
                <div 
                  className="loading-spinner"
                  style={{
                    width: '48px',
                    height: '48px',
                    border: '3px solid var(--md-surface-variant)',
                    borderTop: '3px solid var(--md-primary)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}
                  aria-label="Generating..."
                />
              )}
            </div>
            
            {!isGenerating && (
              <>
                <div className="text-preview">
                  {previewText}
                </div>

                {/* Action Buttons */}
                <div 
                  className="button-group" 
                  style={{ marginTop: '24px' }}
                >
                  <button 
                    className="btn btn-tonal"
                    onClick={() => {
                      if (canvasRef.current) {
                        canvasRef.current.toBlob((blob) => {
                          if (blob) {
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `qrcode-${Date.now()}.png`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }
                        });
                      }
                    }}
                    aria-label="Download QR code"
                  >
                    <svg 
                      width="18" 
                      height="18" 
                      viewBox="0 0 24 24" 
                      fill="currentColor"
                      style={{ marginRight: '8px' }}
                      aria-hidden="true"
                    >
                      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                    </svg>
                    Download Image
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>

    </div>
  );
};

export default QRCodePage;