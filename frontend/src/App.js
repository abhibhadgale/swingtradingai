import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Track from './pages/Track';
import TradeDashboard from './pages/TradeDashboard';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/track" element={<Track />} />
        <Route path="/trades" element={<TradeDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
