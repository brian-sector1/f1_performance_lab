import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getSession = async (year, event, sessionType) => {
  try {
    const response = await api.get(`/api/session/${year}/${event}/${sessionType}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch session');
  }
};

export const getDrivers = async (year, event, sessionType) => {
  try {
    const response = await api.get(`/api/session/${year}/${event}/${sessionType}/drivers`);
    return response.data.drivers;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch drivers');
  }
};

export const getLaps = async (year, event, sessionType, driver = null) => {
  try {
    const url = `/api/session/${year}/${event}/${sessionType}/laps${driver ? `?driver=${driver}` : ''}`;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch laps');
  }
};

export const getResults = async (year, event, sessionType) => {
  try {
    const response = await api.get(`/api/session/${year}/${event}/${sessionType}/results`);
    return response.data.results;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch results');
  }
};

export default api;
