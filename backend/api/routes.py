from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from backend.services.fastf1_service import FastF1Service

router = APIRouter()
fastf1_service = FastF1Service()

@router.get("/sessions")
async def list_sessions():
    """
    List available sessions (example endpoint - returns common sessions)
    In a full implementation, this could scan available data
    """
    # Return some example sessions for now
    # In production, you might want to scan the cache or provide a list
    return {
        "message": "Use /api/session/{year}/{event}/{session_type} to get specific session data",
        "examples": [
            {"year": 2021, "event": "Monaco", "session_type": "R"},
            {"year": 2021, "event": "Silverstone", "session_type": "Q"},
            {"year": 2019, "event": "Monaco", "session_type": "R"},
        ]
    }

@router.get("/session/{year}/{event}/{session_type}")
async def get_session(
    year: int,
    event: str,
    session_type: str
):
    """
    Get basic session information
    
    Args:
        year: Race year
        event: Event name
        session_type: Session type (R, Q, FP1, FP2, FP3, S)
    """
    try:
        session = fastf1_service.get_session(year, event, session_type)
        session_info = fastf1_service.get_session_info(session)
        return session_info
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Session not found: {str(e)}")

@router.get("/session/{year}/{event}/{session_type}/drivers")
async def get_drivers(
    year: int,
    event: str,
    session_type: str
):
    """
    Get list of drivers in the session
    
    Args:
        year: Race year
        event: Event name
        session_type: Session type (R, Q, FP1, FP2, FP3, S)
    """
    try:
        session = fastf1_service.get_session(year, event, session_type)
        drivers = fastf1_service.get_drivers(session)
        return {"drivers": drivers}
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Session not found: {str(e)}")

@router.get("/session/{year}/{event}/{session_type}/laps")
async def get_laps(
    year: int,
    event: str,
    session_type: str,
    driver: Optional[str] = Query(None, description="Filter by driver abbreviation (e.g., VER, HAM)")
):
    """
    Get lap data for the session
    
    Args:
        year: Race year
        event: Event name
        session_type: Session type (R, Q, FP1, FP2, FP3, S)
        driver: Optional driver abbreviation to filter laps
    """
    try:
        session = fastf1_service.get_session(year, event, session_type)
        laps = fastf1_service.get_laps(session, driver)
        return {
            "laps": laps,
            "count": len(laps),
            "driver": driver
        }
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Session not found: {str(e)}")

@router.get("/session/{year}/{event}/{session_type}/results")
async def get_results(
    year: int,
    event: str,
    session_type: str
):
    """
    Get session results
    
    Args:
        year: Race year
        event: Event name
        session_type: Session type (R, Q, FP1, FP2, FP3, S)
    """
    try:
        session = fastf1_service.get_session(year, event, session_type)
        results = fastf1_service.get_results(session)
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Session not found: {str(e)}")
