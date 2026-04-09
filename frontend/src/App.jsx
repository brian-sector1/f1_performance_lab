import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import SessionSelector from './components/SessionSelector';
import DriverList from './components/DriverList';
import LapTable from './components/LapTable';
import ResultsTable from './components/ResultsTable';
import TrackMap from './components/TrackMap';
import DriverLaps from './pages/DriverLaps';
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
      console.log('Fetching data for:', year, event, sessionType);
      
      // Fetch all data, but handle errors individually
      const results = await Promise.allSettled([
        getDrivers(year, event, sessionType),
        getLaps(year, event, sessionType),
        getResults(year, event, sessionType),
      ]);
      
      const [driversResult, lapsResult, resultsResult] = results;
      
      // Handle drivers
      if (driversResult.status === 'fulfilled') {
        setDrivers(driversResult.value || []);
      } else {
        console.error('Error fetching drivers:', driversResult.reason);
        setDrivers([]);
      }
      
      // Handle laps
      if (lapsResult.status === 'fulfilled') {
        setLaps(lapsResult.value || { laps: [], count: 0 });
      } else {
        console.error('Error fetching laps:', lapsResult.reason);
        setLaps({ laps: [], count: 0 });
      }
      
      // Handle results
      if (resultsResult.status === 'fulfilled') {
        setResults(resultsResult.value || []);
      } else {
        console.error('Error fetching results:', resultsResult.reason);
        setResults([]);
      }
      
      // Show error if all requests failed
      const allFailed = results.every(r => r.status === 'rejected');
      if (allFailed) {
        const errorMessages = results
          .filter(r => r.status === 'rejected')
          .map(r => r.reason?.message || 'Unknown error')
          .join('; ');
        setError(`Failed to fetch data: ${errorMessages}`);
      } else {
        // Clear error if at least one request succeeded
        setError(null);
      }
      
      console.log('Data received:', { 
        drivers: driversResult.status === 'fulfilled' ? driversResult.value : 'failed',
        laps: lapsResult.status === 'fulfilled' ? lapsResult.value : 'failed',
        results: resultsResult.status === 'fulfilled' ? resultsResult.value : 'failed'
      });
      
      setActiveTab('drivers');
    } catch (err) {
      console.error('Unexpected error in handleSessionSelect:', err);
      setError(err.message || 'An unexpected error occurred');
      setDrivers([]);
      setLaps([]);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <header className="app-header">
                <h1>🏎️ F1 Performance Lab</h1>
                <p>Explore Formula 1 session data</p>
                <div className="social-links">
                  <a
                    href="https://www.linkedin.com/in/brian-benedicto/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="social-link"
                    title="LinkedIn"
                  >
                    <svg viewBox="0 0 16 16" aria-hidden="true">
                      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.473 0 16 .513 16 1.146v13.708c0 .633-.527 1.146-1.175 1.146H1.175A1.162 1.162 0 0 1 0 14.854zM4.943 13.5V6.169H2.542V13.5zM3.742 5.167c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.247-1.341-1.247S2.4 3.21 2.4 3.92c0 .694.521 1.248 1.325 1.248zm9.758 8.333v-4.398c0-2.355-1.255-3.45-2.928-3.45-1.35 0-1.954.743-2.29 1.265v.026h-.017a5.54 5.54 0 0 1 .017-.026V6.169H5.88c.03.694 0 7.331 0 7.331h2.401V9.404c0-.22.016-.44.082-.598.18-.44.59-.896 1.279-.896.902 0 1.263.676 1.263 1.668V13.5z" />
                    </svg>
                  </a>
                  <a
                    href="https://github.com/brian-sector1"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="social-link"
                    title="GitHub"
                  >
                    <svg viewBox="0 0 16 16" aria-hidden="true">
                      <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.5-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.57 7.57 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
                    </svg>
                  </a>
                </div>
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
                      <button
                        className={activeTab === 'track' ? 'active' : ''}
                        onClick={() => setActiveTab('track')}
                      >
                        Track
                      </button>
                    </div>

                    <div className="tab-content">
                      {loading && <div className="loading">Loading...</div>}
                      
                      {!loading && activeTab === 'drivers' && (
                        <DriverList
                          drivers={drivers}
                          sessionInfo={selectedSession}
                        />
                      )}
                      
                      {!loading && activeTab === 'laps' && (
                        <LapTable laps={laps.laps || laps} />
                      )}
                      
                      {!loading && activeTab === 'results' && (
                        <ResultsTable results={results} />
                      )}
                      {!loading && activeTab === 'track' && (
                        <TrackMap sessionInfo={selectedSession} />
                      )}
                    </div>
                  </div>
                )}
              </main>
            </>
          }
        />
        <Route
          path="/driver/:year/:event/:sessionType/:driver"
          element={<DriverLaps />}
        />
      </Routes>
    </div>
  );
}

export default App;
