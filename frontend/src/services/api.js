import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds timeout for FastF1 data loading
});

export const getSession = async (year, event, sessionType) => {
  try {
    const response = await api.get(`/api/session/${year}/${event}/${sessionType}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching session:', error);
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch session';
    throw new Error(errorMessage);
  }
};

export const getDrivers = async (year, event, sessionType) => {
  try {
    const response = await api.get(`/api/session/${year}/${event}/${sessionType}/drivers`);
    console.log('Drivers response:', response.data);
    return response.data.drivers || [];
  } catch (error) {
    console.error('Error fetching drivers:', error);
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch drivers';
    throw new Error(errorMessage);
  }
};

export const getLaps = async (year, event, sessionType, driver = null) => {
  try {
    const url = `/api/session/${year}/${event}/${sessionType}/laps${driver ? `?driver=${driver}` : ''}`;
    const response = await api.get(url);
    console.log('Laps response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching laps:', error);
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch laps';
    throw new Error(errorMessage);
  }
};

export const getResults = async (year, event, sessionType) => {
  try {
    const response = await api.get(`/api/session/${year}/${event}/${sessionType}/results`);
    console.log('Results response:', response.data);
    return response.data.results || [];
  } catch (error) {
    console.error('Error fetching results:', error);
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch results';
    throw new Error(errorMessage);
  }
};

export default api;
