# CryptoDash 📊

A modern, real-time cryptocurrency dashboard built with React, TypeScript, and TradingView Lightweight Charts.

![CryptoDash](public/logo.png)

## Features

- 📈 **Real-time Price Tracking**: View top 10 cryptocurrencies with live price updates
- 📊 **Interactive Charts**: TradingView Lightweight Charts with candlestick visualization
- ⏱️ **Multiple Timeframes**: Switch between 1H, 24H, 7D, and 30D views
- 🎨 **Modern UI**: Built with Tailwind CSS v4 and shadcn/ui components
- 🌙 **Dark Mode**: System-aware dark mode support
- 🔄 **Auto-refresh**: Data updates every 30s (homepage) and 10s (detail page)
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI)
- **Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios with interceptors
- **Charts**: TradingView Lightweight Charts v5
- **Routing**: React Router v6

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd crypto-light-charts
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. (Optional) Add your FreeCryptoAPI key to `.env`:
   ```
   VITE_API_KEY=your_api_key_here
   ```

   > **Note**: The app works in mock mode by default. Add an API key to use real data.

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Project Structure

```
crypto-light-charts/
├── public/
│   └── logo.png              # App logo
├── src/
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── table.tsx
│   │   │   └── skeleton.tsx
│   │   └── CryptoChart.tsx   # Chart component
│   ├── hooks/
│   │   └── useCrypto.ts      # React Query hooks
│   ├── lib/
│   │   ├── api.ts            # API client (Axios)
│   │   └── utils.ts          # Utility functions
│   ├── pages/
│   │   ├── Home.tsx          # Top 10 list
│   │   └── Detail.tsx        # Coin detail page
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles
├── .env.example              # Environment variables template
├── tailwind.config.js        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── vite.config.ts            # Vite configuration
```

## API Integration

The app uses [FreeCryptoAPI](https://freecryptoapi.com) for cryptocurrency data. The API client is configured with:

- **Axios instance** with base URL
- **Bearer token authentication** via request interceptor
- **Automatic fallback** to mock data when no API key is provided
- **Error handling** with console logging

### API Endpoints Used

- `/getTop` - Top cryptocurrencies
- `/getHistory` - Historical price data

## Features in Detail

### Homepage
- Displays top 10 cryptocurrencies
- Shows: Name, Symbol, Price, 24h Change, Market Cap, Volume
- Color-coded price changes (green/red)
- Auto-refresh every 30 seconds
- Click any row to view details

### Detail Page
- Interactive candlestick chart
- Timeframe selector (1H, 24H, 7D, 30D)
- Market statistics panel
- Auto-refresh every 10 seconds
- Responsive layout

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Acknowledgments

- [TradingView Lightweight Charts](https://github.com/tradingview/lightweight-charts)
- [shadcn/ui](https://ui.shadcn.com/)
- [FreeCryptoAPI](https://freecryptoapi.com)
