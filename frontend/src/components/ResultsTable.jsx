import { formatLapTime } from '../utils/formatLapTime';

const ResultsTable = ({ results }) => {
  if (!results || results.length === 0) {
    return <div className="empty-state">No results available</div>;
  }

  // Sort by position so drivers are always ordered 1, 2, 3...
  const sortedResults = [...results].sort((a, b) => {
    const posA = a.position ?? 999;
    const posB = b.position ?? 999;
    return posA - posB;
  });

  return (
    <div className="results-table">
      <h3>Session Results</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Pos</th>
              <th>Driver</th>
              <th>Name</th>
              <th>Team</th>
              <th>Q1</th>
              <th>Q2</th>
              <th>Q3</th>
              <th>Best Lap</th>
              <th>Points</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedResults.map((result, index) => (
              <tr key={result.abbreviation ?? index} className={result.position === 1 ? 'winner' : ''}>
                <td className="position">{result.position ?? index + 1}</td>
                <td className="driver-cell">{result.abbreviation}</td>
                <td>{result.name}</td>
                <td>{result.team}</td>
                <td>{formatLapTime(result.q1) ?? '-'}</td>
                <td>{formatLapTime(result.q2) ?? '-'}</td>
                <td>{formatLapTime(result.q3) ?? '-'}</td>
                <td>{formatLapTime(result.best_lap_time) ?? '-'}</td>
                <td>{result.points > 0 ? result.points : '-'}</td>
                <td>{result.status || 'Finished'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;
