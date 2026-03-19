import { useState } from 'react';
import { formatLapTime, parseLapTimeToSeconds } from '../utils/formatLapTime';

const LapTable = ({ laps }) => {
  const [sortBy, setSortBy] = useState('lap_time');
  const [sortDir, setSortDir] = useState('asc');

  if (!laps || laps.length === 0) {
    return <div className="empty-state">No lap data available</div>;
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
      case 'lap_number':
      case 'tyre_life':
        return row[key] ?? 9999;
      case 'lap_time':
      case 'sector_1_time':
      case 'sector_2_time':
      case 'sector_3_time':
        return parseLapTimeToSeconds(row[key]);
      default:
        return String(row[key] ?? '').toLowerCase();
    }
  };

  const sortedLaps = [...laps].sort((a, b) => {
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
      {sortBy === colKey && <span className="sort-arrow">{sortDir === 'asc' ? ' ▼' : ' ▲'}</span>}
    </th>
  );

  return (
    <div className="lap-table">
      <h3>Lap Data</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <SortHeader colKey="driver" label="Driver" />
              <SortHeader colKey="lap_number" label="Lap" />
              <SortHeader colKey="lap_time" label="Lap Time" />
              <SortHeader colKey="sector_1_time" label="Sector 1" />
              <SortHeader colKey="sector_2_time" label="Sector 2" />
              <SortHeader colKey="sector_3_time" label="Sector 3" />
              <SortHeader colKey="compound" label="Compound" />
              <SortHeader colKey="tyre_life" label="Tyre Life" />
              <th>Flags</th>
            </tr>
          </thead>
          <tbody>
            {sortedLaps.map((lap, index) => (
              <tr key={`${lap.driver}-${lap.lap_number}-${index}`} className={lap.is_fastest ? 'fastest-lap' : ''}>
                <td className="driver-cell">{lap.driver}</td>
                <td>{lap.lap_number}</td>
                <td className={lap.is_personal_best ? 'personal-best' : ''}>
                  {formatLapTime(lap.lap_time) ?? '-'}
                </td>
                <td>{formatLapTime(lap.sector_1_time) ?? '-'}</td>
                <td>{formatLapTime(lap.sector_2_time) ?? '-'}</td>
                <td>{formatLapTime(lap.sector_3_time) ?? '-'}</td>
                <td>{lap.compound || '-'}</td>
                <td>{lap.tyre_life || '-'}</td>
                <td>
                  {lap.is_personal_best && <span className="flag pb">PB</span>}
                  {lap.is_fastest && <span className="flag fastest">F</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LapTable;
