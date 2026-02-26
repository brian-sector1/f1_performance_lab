import { useState, useEffect } from 'react';
import { getCircuit } from '../services/api';

const TrackMap = ({ sessionInfo }) => {
  const [circuit, setCircuit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionInfo) return;
    setLoading(true);
    setError(null);
    getCircuit(sessionInfo.year, sessionInfo.event, sessionInfo.sessionType)
      .then((data) => {
        if (data?.error) {
          setError(data.error);
          setCircuit(null);
        } else {
          setCircuit(data);
          setError(null);
        }
      })
      .catch((err) => {
        setError(err.message || 'Failed to load track map');
        setCircuit(null);
      })
      .finally(() => setLoading(false));
  }, [sessionInfo?.year, sessionInfo?.event, sessionInfo?.sessionType]);

  if (loading) {
    return <div className="track-map-loading">Loading track map...</div>;
  }
  if (error) {
    return (
      <div className="track-map-error">
        <p>Could not load track map</p>
        <p className="track-map-error-detail">{error}</p>
      </div>
    );
  }
  if (!circuit || (!circuit.track?.length && !circuit.corners?.length)) {
    return (
      <div className="track-map-empty">
        <p>No track data available for this circuit</p>
      </div>
    );
  }

  // Combine track and corners to compute bounds; SVG y is flipped (y increases down)
  const allPoints = [
    ...(circuit.track || []).map(([x, y]) => [x, -y]),
    ...(circuit.corners || []).map((c) => [c.x, -c.y]),
  ];
  if (allPoints.length === 0) {
    return (
      <div className="track-map-empty">
        <p>No track data available for this circuit</p>
      </div>
    );
  }
  const xs = allPoints.map((p) => p[0]);
  const ys = allPoints.map((p) => p[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const pad = 80;
  const width = maxX - minX + 2 * pad || 400;
  const height = maxY - minY + 2 * pad || 300;
  const viewBox = `${minX - pad} ${minY - pad} ${width} ${height}`;

  // Track path: flip y for SVG (circuit coords have y up)
  const trackPath =
    circuit.track?.length > 0
      ? circuit.track
          .map(([x, y]) => `${x},${-y}`)
          .join(' ')
      : '';

  return (
    <div className="track-map">
      <h3>Track Map — {circuit.location || 'Circuit'}</h3>
      <div className="track-map-svg-container">
        <svg
          className="track-map-svg"
          viewBox={viewBox}
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Track outline */}
          {trackPath && (
            <polyline
              points={trackPath}
              fill="none"
              stroke="#ff4444"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          {/* Corner markers */}
          {(circuit.corners || []).map((corner, i) => (
            <g key={i}>
              <circle
                cx={corner.x}
                cy={-corner.y}
                r="40"
                fill="#ffffff"
                stroke="#e10600"
                strokeWidth="2"
              />
              <text
                x={corner.x}
                y={-corner.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#e0e0e0"
                fontSize="14"
                fontWeight="bold"
              >
                {corner.number}
                {corner.letter}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default TrackMap;
