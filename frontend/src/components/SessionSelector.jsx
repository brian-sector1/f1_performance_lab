import { useState } from 'react';

const SessionSelector = ({ onSelect, loading }) => {
  const [year, setYear] = useState(2021);
  const [event, setEvent] = useState('Monaco');
  const [sessionType, setSessionType] = useState('R');

  const events = [
    'Bahrain', 'Imola', 'Portimão', 'Barcelona', 'Monaco', 'Baku',
    'France', 'Austria', 'Silverstone', 'Hungary', 'Spa', 'Zandvoort',
    'Monza', 'Sochi', 'Istanbul', 'Austin', 'Mexico City', 'São Paulo',
    'Qatar', 'Jeddah', 'Abu Dhabi'
  ];

  const sessionTypes = [
    { value: 'FP1', label: 'Free Practice 1' },
    { value: 'FP2', label: 'Free Practice 2' },
    { value: 'FP3', label: 'Free Practice 3' },
    { value: 'Q', label: 'Qualifying' },
    { value: 'S', label: 'Sprint' },
    { value: 'R', label: 'Race' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSelect(year, event, sessionType);
  };

  return (
    <div className="session-selector">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="year">Year:</label>
          <input
            id="year"
            type="number"
            min="2018"
            max="2024"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="event">Event:</label>
          <select
            id="event"
            value={event}
            onChange={(e) => setEvent(e.target.value)}
            required
          >
            {events.map((evt) => (
              <option key={evt} value={evt}>
                {evt}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="sessionType">Session Type:</label>
          <select
            id="sessionType"
            value={sessionType}
            onChange={(e) => setSessionType(e.target.value)}
            required
          >
            {sessionTypes.map((st) => (
              <option key={st.value} value={st.value}>
                {st.label}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Load Session'}
        </button>
      </form>
    </div>
  );
};

export default SessionSelector;
