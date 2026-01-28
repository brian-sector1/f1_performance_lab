import { useNavigate } from 'react-router-dom';

const DriverList = ({ drivers, sessionInfo }) => {
  const navigate = useNavigate();

  if (!drivers || drivers.length === 0) {
    return <div className="empty-state">No drivers found</div>;
  }

  const handleDriverClick = (driverAbbreviation) => {
    if (sessionInfo) {
      navigate(
        `/driver/${sessionInfo.year}/${sessionInfo.event}/${sessionInfo.sessionType}/${driverAbbreviation}`
      );
    }
  };

  return (
    <div className="driver-list">
      <h3>Drivers</h3>
      <div className="drivers-grid">
        {drivers.map((driver) => (
          <div
            key={driver.abbreviation}
            className="driver-card"
            onClick={() => handleDriverClick(driver.abbreviation)}
          >
            <div className="driver-number">{driver.number}</div>
            <div className="driver-info">
              <div className="driver-abbreviation">{driver.abbreviation}</div>
              <div className="driver-name">{driver.name}</div>
              <div className="driver-team">{driver.team}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverList;
