import { useState } from 'react';
import { formatLapTime, parseLapTimeToSeconds } from '../utils/formatLapTime';

const SORT_OPTIONS = [
  { key: 'position', label: 'Position' },
  { key: 'abbreviation', label: 'Driver' },
  { key: 'name', label: 'Name' },
  { key: 'team', label: 'Team' },
  { key: 'q1', label: 'Q1' },
  { key: 'q2', label: 'Q2' },
  { key: 'q3', label: 'Q3' },
  { key: 'best_lap_time', label: 'Best Lap' },
  { key: 'points', label: 'Points' },
];

const ResultsTable = ({ results }) => {
  const [sortBy, setSortBy] = useState('position');
  const [sortDir, setSortDir] = useState('asc');

  if (!results || results.length === 0) {
    return <div className="empty-state">No results available</div>;
  }

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortDir('asc');
    }
  };

  const getSortValue = (row, key) => {
    switch (key) {
      case 'position':
        return row.position ?? 999;
      case 'q1':
      case 'q2':
      case 'q3':
      case 'best_lap_time':
        return parseLapTimeToSeconds(row[key]);
      case 'points':
        return row.points ?? -1;
      default:
        return String(row[key] ?? '').toLowerCase();
    }
  };

  const sortedResults = [...results].sort((a, b) => {
    const va = getSortValue(a, sortBy);
    const vb = getSortValue(b, sortBy);
    let cmp = 0;
    if (typeof va === 'number' && typeof vb === 'number') cmp = va - vb;
    else cmp = String(va).localeCompare(String(vb), undefined, { numeric: true });
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const SortHeader = ({ colKey, label }) => (
    <th
      className="sortable"
      onClick={() => handleSort(colKey)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleSort(colKey)}
    >
      {label}
      {sortBy === colKey && <span className="sort-arrow">{sortDir === 'asc' ? ' ▲' : ' ▼'}</span>}
    </th>
  );

  return (
    <div className="results-table">
      <h3>Session Results</h3>
      <div className="results-table-sort">
        <label>Sort by:</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          {SORT_OPTIONS.map(({ key, label }) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <button
          type="button"
          className="sort-dir-btn"
          onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
          title={sortDir === 'asc' ? 'Ascending (click for descending)' : 'Descending (click for ascending)'}
        >
          {sortDir === 'asc' ? '▲ Asc' : '▼ Desc'}
        </button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <SortHeader colKey="position" label="Pos" />
              <SortHeader colKey="abbreviation" label="Driver" />
              <SortHeader colKey="name" label="Name" />
              <SortHeader colKey="team" label="Team" />
              <SortHeader colKey="q1" label="Q1" />
              <SortHeader colKey="q2" label="Q2" />
              <SortHeader colKey="q3" label="Q3" />
              <SortHeader colKey="best_lap_time" label="Best Lap" />
              <SortHeader colKey="points" label="Points" />
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
