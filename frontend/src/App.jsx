import { useState } from 'react';
import SessionSelector from './components/SessionSelector';
import DriverList from './components/DriverList';
import LapTable from './components/LapTable';
import ResultsTable from './components/ResultsTable';
import { getDrivers, getLaps, getResults } from './services/api';

function App() {
  const [selectedSession, setSelectedSession] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [laps, setLaps] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('drivers');

  const handleSessionSelect = async (year, event, sessionType) => {
    setLoading(true);
    setError(null);
    setSelectedSession({ year, event, sessionType });
    
    try {
      const [driversData, lapsData, resultsData] = await Promise.all([
        getDrivers(year, event, sessionType),
        getLaps(year, event, sessionType),
        getResults(year, event, sessionType),
      ]);
      
      setDrivers(driversData);
      setLaps(lapsData);
      setResults(resultsData);
      setActiveTab('drivers');
    } catch (err) {
      setError(err.message);
      setDrivers([]);
      setLaps([]);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDriverFilter = async (driver) => {
    if (!selectedSession) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const lapsData = await getLaps(
        selectedSession.year,
        selectedSession.event,
        selectedSession.sessionType,
        driver
      );
      setLaps(lapsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏎️ F1 Performance Lab</h1>
        <p>Explore Formula 1 session data</p>
      </header>

      <main className="app-main">
        <SessionSelector onSelect={handleSessionSelect} loading={loading} />

        {error && (
          <div className="error-message">
            <p>❌ Error: {error}</p>
            <p className="error-hint">Make sure the backend server is running on port 8000</p>
          </div>
        )}

        {selectedSession && !error && (
          <div className="session-content">
            <div className="session-info">
              <h2>
                {selectedSession.event} {selectedSession.year} - {selectedSession.sessionType}
              </h2>
            </div>

            <div className="tabs">
              <button
                className={activeTab === 'drivers' ? 'active' : ''}
                onClick={() => setActiveTab('drivers')}
              >
                Drivers ({drivers.length})
              </button>
              <button
                className={activeTab === 'laps' ? 'active' : ''}
                onClick={() => setActiveTab('laps')}
              >
                Laps ({laps.count || laps.length})
              </button>
              <button
                className={activeTab === 'results' ? 'active' : ''}
                onClick={() => setActiveTab('results')}
              >
                Results ({results.length})
              </button>
            </div>

            <div className="tab-content">
              {loading && <div className="loading">Loading...</div>}
              
              {!loading && activeTab === 'drivers' && (
                <DriverList drivers={drivers} onDriverClick={handleDriverFilter} />
              )}
              
              {!loading && activeTab === 'laps' && (
                <LapTable laps={laps.laps || laps} />
              )}
              
              {!loading && activeTab === 'results' && (
                <ResultsTable results={results} />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
