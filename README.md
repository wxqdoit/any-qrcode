# Any QRCode - React Version

A Chrome extension built with React and TypeScript that generates QR codes from selected text or manual input.

## Features

- 🎯 Generate QR codes from selected text via right-click menu
- ✍️ Manual text input with support for up to 800 characters
- 📜 History tracking (last 20 QR codes)
- 🎨 Modern UI with gradient design
- ⚡ Built with React and TypeScript for better performance

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development Mode

Run the extension in development mode with hot reload:

```bash
npm run dev
```

### Production Build

Build the extension for production:

```bash
npm run build
```

The built extension will be in the `dist/` directory.

## Installation in Chrome

1. Build the extension: `npm run build`
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked"
5. Select the `dist/` directory

## Project Structure

```
src/
├── background/
│   └── index.ts         # Background service worker
├── popup/
│   ├── index.tsx        # Entry point
│   ├── App.tsx          # Main app component
│   ├── styles.css       # Global styles
│   ├── types.ts         # TypeScript types
│   └── components/
│       ├── HomePage.tsx     # Home page with input
│       ├── QRCodePage.tsx   # QR code display
│       └── HistoryPage.tsx  # History list
public/
├── manifest.json        # Extension manifest
└── icons/              # Extension icons
```

## Technologies

- React 18
- TypeScript
- Webpack 5
- Chrome Extension Manifest V3
- qrcode library

## License

MIT