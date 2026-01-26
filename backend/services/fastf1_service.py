import fastf1
from typing import Dict, List, Optional, Any
import pandas as pd

class FastF1Service:
    """Service for fetching and processing FastF1 data"""
    
    def __init__(self):
        # Enable caching for better performance
        fastf1.Cache.enable_cache('~/.cache/fastf1')
    
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
                laps = laps.pick_drivers(driver)
            
            # Convert to list of dictionaries
            laps_data = []
            for _, lap in laps.iterrows():
                lap_dict = {
                    "driver": lap["Driver"],
                    "lap_number": int(lap["LapNumber"]),
                    "lap_time": str(lap["LapTime"]) if pd.notna(lap["LapTime"]) else None,
                    "sector_1_time": str(lap["Sector1Time"]) if pd.notna(lap["Sector1Time"]) else None,
                    "sector_2_time": str(lap["Sector2Time"]) if pd.notna(lap["Sector2Time"]) else None,
                    "sector_3_time": str(lap["Sector3Time"]) if pd.notna(lap["Sector3Time"]) else None,
                    "compound": lap["Compound"] if pd.notna(lap["Compound"]) else None,
                    "tyre_life": int(lap["TyreLife"]) if pd.notna(lap["TyreLife"]) else None,
                    "is_personal_best": bool(lap["IsPersonalBest"]) if pd.notna(lap["IsPersonalBest"]) else False,
                    "is_fastest": bool(lap["IsFastest"]) if pd.notna(lap["IsFastest"]) else False,
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
            
            for _, result in results.iterrows():
                result_dict = {
                    "position": int(result["Position"]) if pd.notna(result["Position"]) else None,
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
