import fastf1
from typing import Dict, List, Optional, Any
import pandas as pd
import os
from pathlib import Path

class FastF1Service:
    """Service for fetching and processing FastF1 data"""
    
    def __init__(self):
        # Enable caching for better performance
        # Expand ~ to home directory and create cache directory if it doesn't exist
        cache_dir = os.path.expanduser('~/.cache/fastf1')
        Path(cache_dir).mkdir(parents=True, exist_ok=True)
        fastf1.Cache.enable_cache(cache_dir)
    
    def get_session(self, year: int, event: str, session_type: str):
        """
        Load a session from FastF1
        
        Args:
            year: Race year
            event: Event name (e.g., 'Monaco', 'Silverstone')
            session_type: Session type ('R' for Race, 'Q' for Qualifying, 'FP1', 'FP2', 'FP3', 'S' for Sprint)
        
        Returns:
            FastF1 session object
        """
        session = fastf1.get_session(year, event, session_type)
        session.load()
        return session
    
    def get_drivers(self, session) -> List[Dict[str, Any]]:
        """
        Get list of drivers in the session
        
        Returns:
            List of driver dictionaries
        """
        try:
            drivers = []
            for driver in session.drivers:
                driver_info = session.get_driver(driver)
                drivers.append({
                    "abbreviation": driver_info["Abbreviation"],
                    "number": int(driver_info["DriverNumber"]),
                    "name": driver_info["FullName"],
                    "team": driver_info["TeamName"],
                })
            return drivers
        except Exception as e:
            return []
    
    def get_laps(self, session, driver: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Get lap data for the session
        
        Args:
            session: FastF1 session object
            driver: Optional driver abbreviation to filter laps
        
        Returns:
            List of lap dictionaries
        """
        try:
            laps = session.laps
            
            if driver:
                # Try abbreviation first (e.g. "BOT", "VER")
                laps = laps.pick_drivers(driver)
                # If no laps found, try resolving abbreviation to driver number
                if len(laps) == 0:
                    for drv_num in session.drivers:
                        try:
                            info = session.get_driver(drv_num)
                            if info.get("Abbreviation") == driver:
                                laps = session.laps.pick_drivers(drv_num)
                                break
                        except (KeyError, TypeError):
                            continue
            
            # Reset index so MultiIndex levels become columns (FastF1 laps can have MultiIndex)
            if hasattr(laps, 'reset_index') and not laps.empty:
                laps = laps.reset_index()
            
            # Convert to list of dictionaries
            laps_data = []
            for _, lap in laps.iterrows():
                driver_abbrev = lap.get("Driver", driver or "")
                if pd.isna(driver_abbrev):
                    driver_abbrev = driver or ""
                lap_dict = {
                    "driver": str(driver_abbrev) if driver_abbrev else (driver or ""),
                    "lap_number": int(lap.get("LapNumber", 0)) if pd.notna(lap.get("LapNumber")) else 0,
                    "lap_time": str(lap.get("LapTime")) if pd.notna(lap.get("LapTime")) else None,
                    "sector_1_time": str(lap.get("Sector1Time")) if pd.notna(lap.get("Sector1Time")) else None,
                    "sector_2_time": str(lap.get("Sector2Time")) if pd.notna(lap.get("Sector2Time")) else None,
                    "sector_3_time": str(lap.get("Sector3Time")) if pd.notna(lap.get("Sector3Time")) else None,
                    "compound": lap.get("Compound") if pd.notna(lap.get("Compound")) else None,
                    "tyre_life": int(lap.get("TyreLife")) if pd.notna(lap.get("TyreLife")) else None,
                    "is_personal_best": bool(lap.get("IsPersonalBest")) if pd.notna(lap.get("IsPersonalBest")) else False,
                    "is_fastest": bool(lap.get("IsFastest")) if pd.notna(lap.get("IsFastest")) else False,
                }
                laps_data.append(lap_dict)
            
            return laps_data
        except Exception as e:
            return []
    
    def get_results(self, session) -> List[Dict[str, Any]]:
        """
        Get session results
        
        Returns:
            List of result dictionaries
        """
        try:
            results = session.results
            results_data = []
            
            for i, (_, result) in enumerate(results.iterrows()):
                # Position: use FastF1 'Position' when available, else 1-based row order (results are sorted by position)
                pos_raw = result.get("Position")
                position = int(pos_raw) if pd.notna(pos_raw) else (i + 1)
                result_dict = {
                    "position": position,
                    "abbreviation": result["Abbreviation"],
                    "driver_number": int(result["DriverNumber"]) if pd.notna(result["DriverNumber"]) else None,
                    "name": result["FullName"],
                    "team": result["TeamName"],
                    "q1": str(result["Q1"]) if pd.notna(result.get("Q1")) else None,
                    "q2": str(result["Q2"]) if pd.notna(result.get("Q2")) else None,
                    "q3": str(result["Q3"]) if pd.notna(result.get("Q3")) else None,
                    "best_lap_time": str(result["FastestLapTime"]) if pd.notna(result.get("FastestLapTime")) else None,
                    "points": float(result["Points"]) if pd.notna(result.get("Points")) else 0.0,
                    "status": result["Status"] if pd.notna(result.get("Status")) else None,
                }
                results_data.append(result_dict)
            
            # Ensure results are ordered by position
            results_data.sort(key=lambda r: (r["position"] is None, r["position"] or 999))
            return results_data
        except Exception as e:
            return []
    
    def get_session_info(self, session) -> Dict[str, Any]:
        """
        Get basic session information
        
        Returns:
            Dictionary with session metadata
        """
        try:
            return {
                "year": session.event.year,
                "event_name": session.event["EventName"],
                "location": session.event["Location"],
                "session_name": session.name,
                "session_date": str(session.date) if session.date else None,
                "session_type": session.session_type,
            }
        except Exception as e:
            return {}
