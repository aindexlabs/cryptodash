import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Detail from '@/pages/Detail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background font-sans antialiased">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center px-4">
            <div className="mr-4 flex">
              <a className="mr-6 flex items-center space-x-2 font-bold text-xl tracking-tight" href="/">
                <img src="/logo.png" alt="CryptoDash" className="w-8 h-8 rounded-md" />
                <span className="bg-gradient-to-tr from-primary to-blue-600 bg-clip-text text-transparent">
                  CryptoDash
                </span>
              </a>
            </div>
          </div>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/crypto/:symbol" element={<Detail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
