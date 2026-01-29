import { formatLapTime } from '../utils/formatLapTime';

const LapTable = ({ laps }) => {
  if (!laps || laps.length === 0) {
    return <div className="empty-state">No lap data available</div>;
  }

  return (
    <div className="lap-table">
      <h3>Lap Data</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Driver</th>
              <th>Lap</th>
              <th>Lap Time</th>
              <th>Sector 1</th>
              <th>Sector 2</th>
              <th>Sector 3</th>
              <th>Compound</th>
              <th>Tyre Life</th>
              <th>Flags</th>
            </tr>
          </thead>
          <tbody>
            {laps.map((lap, index) => (
              <tr key={index} className={lap.is_fastest ? 'fastest-lap' : ''}>
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
