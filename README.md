# F1 Performance Lab

Hi! I'm Brian and I thought it would be fun to just look at various F1 data and analyze them.

This project combines the power of FastF1 (Python library for Formula 1 data) with a modern React web interface to explore and visualize F1 session data.

This branch is specifically for testing the ML AI so that it does not conflict with the main branch's web interface.

## Project Structure

```
f1_performance_lab/
├── backend/             # FastAPI backend
│   ├── main.py          # FastAPI application
│   ├── api/             # API routes
│   ├── services/        # FastF1 service layer
│   └── requirements.txt # Python dependencies
├── frontend/            # React + Vite frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API client
│   │   └── styles/      # CSS styles
│   └── package.json     # Node dependencies
└── notebooks/           # Jupyter notebooks for analysis
```

## Features

- 🏎️ Browse F1 sessions by year, event, and session type
- 👥 View driver information and teams
- ⏱️ Explore detailed lap data with sector times
- 🏆 Check session results and qualifying times
- 📊 Interactive tables with filtering capabilities

## Setup Instructions

### Prerequisites

- Python 3.8+ (for backend)
- Node.js 16+ and npm (for frontend)

### Backend Setup

1. **Create a virtual environment** (recommended):
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r backend/requirements.txt
   ```

3. **Run the FastAPI server**:
   ```bash
   uvicorn backend.main:app --reload --port 8000
   ```

   The API will be available at `http://localhost:8000`
   - API documentation: `http://localhost:8000/docs`
   - Alternative docs: `http://localhost:8000/redoc`

### Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install Node dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173` (or the port Vite assigns)

### Running Both Servers

You'll need to run both servers simultaneously:

1. **Terminal 1 - Backend**:
   ```bash
   uvicorn backend.main:app --reload --port 8000
   ```

2. **Terminal 2 - Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

## Usage

1. Open your browser to `http://localhost:5173`
2. Select a year, event, and session type from the dropdowns
3. Click "Load Session" to fetch data
4. Navigate between tabs to view:
   - **Drivers**: List of all drivers in the session
   - **Laps**: Detailed lap data (click a driver card to filter)
   - **Results**: Session results and qualifying times

## API Endpoints

The backend provides the following endpoints:

- `GET /api/session/{year}/{event}/{session_type}` - Get session info
- `GET /api/session/{year}/{event}/{session_type}/drivers` - Get drivers
- `GET /api/session/{year}/{event}/{session_type}/laps?driver={abbrev}` - Get laps (optional driver filter)
- `GET /api/session/{year}/{event}/{session_type}/results` - Get results

### Example API Calls

```bash
# Get drivers for 2021 Monaco Race
curl http://localhost:8000/api/session/2021/Monaco/R/drivers

# Get laps for Verstappen in 2021 Monaco Race
curl http://localhost:8000/api/session/2021/Monaco/R/laps?driver=VER
```

## Session Types

- `FP1`, `FP2`, `FP3` - Free Practice sessions
- `Q` - Qualifying
- `S` - Sprint
- `R` - Race

## Notes

- **First-time data loading**: FastF1 downloads data on first request, which may take a minute or two. Data is cached locally in `~/.cache/fastf1` for faster subsequent requests.
- **Data availability**: Not all sessions may be available for all years/events. The API will return a 404 error if a session doesn't exist.
- **CORS**: The backend is configured to allow requests from `localhost:5173` and `localhost:3000` for local development.

## Future Enhancements

- AI model integration for data analysis
- Advanced visualizations and charts
- Telemetry data visualization
- Comparison tools between drivers/sessions
- Historical trend analysis

## Technologies Used

- **Backend**: FastAPI, FastF1, Pandas, Uvicorn
- **Frontend**: React, Vite, Axios
- **Data Source**: FastF1 (Formula 1 official timing data)
