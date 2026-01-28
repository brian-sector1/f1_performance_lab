import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LapTable from '../components/LapTable';
import { getLaps } from '../services/api';

const DriverLaps = () => {
  const { year, event, sessionType, driver } = useParams();
  const navigate = useNavigate();
  const [laps, setLaps] = useState({ laps: [], count: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [driverInfo, setDriverInfo] = useState(null);

  useEffect(() => {
    const fetchDriverLaps = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const lapsData = await getLaps(
          parseInt(year),
          event,
          sessionType,
          driver
        );
        setLaps(lapsData);
        
        // Extract driver info from first lap if available
        if (lapsData.laps && lapsData.laps.length > 0) {
          setDriverInfo({
            abbreviation: driver,
            name: lapsData.laps[0].driver || driver,
          });
        }
      } catch (err) {
        console.error('Error fetching driver laps:', err);
        setError(err.message || 'Failed to fetch driver laps');
      } finally {
        setLoading(false);
      }
    };

    if (year && event && sessionType && driver) {
      fetchDriverLaps();
    }
  }, [year, event, sessionType, driver]);

  return (
    <div className="driver-laps-page">
      <header className="page-header">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>
        <h1>
          {driverInfo?.name || driver} - Lap Data
        </h1>
        <p className="session-info">
          {event} {year} - {sessionType}
        </p>
      </header>

      <main className="page-content">
        {loading && <div className="loading">Loading lap data...</div>}
        
        {error && (
          <div className="error-message">
            <p>❌ Error: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="laps-content">
            <div className="laps-summary">
              <p>Total Laps: {laps.count || laps.laps?.length || 0}</p>
            </div>
            <LapTable laps={laps.laps || laps} />
          </div>
        )}
      </main>
    </div>
  );
};

export default DriverLaps;
