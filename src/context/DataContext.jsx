import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  projectsData as staticProjects,
  districtsData as staticDistricts,
  timelineMilestones as staticTimeline,
  citizenTestimonials as staticTestimonials
} from '../data/projectsData';

const DataContext = createContext();

// Helper to convert snake_case to camelCase
const snakeToCamel = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(v => snakeToCamel(v));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/(_\w)/g, k => k[1].toUpperCase());
      result[camelKey] = snakeToCamel(obj[key]);
      return result;
    }, {});
  }
  return obj;
};

// Helper to convert camelCase to snake_case
const camelToSnake = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(v => camelToSnake(v));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result, key) => {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      result[snakeKey] = camelToSnake(obj[key]);
      return result;
    }, {});
  }
  return obj;
};

export function DataProvider({ children }) {
  const { token, API_BASE_URL } = useAuth();
  
  const [districts, setDistricts] = useState(staticDistricts);
  const [projects, setProjects] = useState(staticProjects);
  const [timeline, setTimeline] = useState(staticTimeline);
  const [testimonials, setTestimonials] = useState(staticTestimonials);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  // Fetch all data from API
  const refreshAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    let apiFailed = false;

    const noCacheHeaders = {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0'
    };

    try {
      // 1. Fetch Districts
      const resDist = await fetch(`${API_BASE_URL}/districts?t=${Date.now()}`, { headers: noCacheHeaders });
      if (resDist.ok) {
        const data = await resDist.json();
        if (data && data.length > 0) setDistricts(snakeToCamel(data));
      } else {
        apiFailed = true;
      }

      // 2. Fetch Projects
      const resProj = await fetch(`${API_BASE_URL}/projects?t=${Date.now()}`, { headers: noCacheHeaders });
      if (resProj.ok) {
        const data = await resProj.json();
        if (data && data.length > 0) setProjects(snakeToCamel(data));
      } else {
        apiFailed = true;
      }

      // 3. Fetch Timeline
      const resTime = await fetch(`${API_BASE_URL}/timeline?t=${Date.now()}`, { headers: noCacheHeaders });
      if (resTime.ok) {
        const data = await resTime.json();
        if (data && data.length > 0) setTimeline(snakeToCamel(data));
      } else {
        apiFailed = true;
      }

      // 4. Fetch Testimonials
      const resTest = await fetch(`${API_BASE_URL}/testimonials?t=${Date.now()}`, { headers: noCacheHeaders });
      if (resTest.ok) {
        const data = await resTest.json();
        if (data && data.length > 0) setTestimonials(snakeToCamel(data));
      } else {
        apiFailed = true;
      }

      setUsingFallback(apiFailed);
    } catch (err) {
      console.warn('Backend API offline or unreachable. Falling back to static showcase data.', err);
      setUsingFallback(true);
      // Keep static files loaded
      setDistricts(staticDistricts);
      setProjects(staticProjects);
      setTimeline(staticTimeline);
      setTestimonials(staticTestimonials);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Headers helper
  const getAuthHeaders = useCallback(() => {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }, [token]);

  // ==========================================
  // PROJECTS CRUD
  // ==========================================
  const saveProject = async (projectData) => {
    const isNew = !projectData.id || !projects.some(p => p.id === projectData.id);
    const url = isNew 
      ? `${API_BASE_URL}/projects` 
      : `${API_BASE_URL}/projects/${projectData.id}`;
    const method = isNew ? 'POST' : 'PUT';

    const response = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(camelToSnake(projectData))
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to save project.');
    }

    const data = await response.json();
    await refreshAllData();
    return data;
  };

  const deleteProject = async (id) => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to delete project.');
    }

    await refreshAllData();
  };

  // ==========================================
  // DISTRICTS CRUD
  // ==========================================
  const saveDistrict = async (districtData) => {
    const isNew = !districts.some(d => d.id === districtData.id);
    const url = isNew 
      ? `${API_BASE_URL}/districts` 
      : `${API_BASE_URL}/districts/${districtData.id}`;
    const method = isNew ? 'POST' : 'PUT';

    const response = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(camelToSnake(districtData))
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to save district.');
    }

    const data = await response.json();
    await refreshAllData();
    return data;
  };

  const deleteDistrict = async (id) => {
    const response = await fetch(`${API_BASE_URL}/districts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to delete district.');
    }

    await refreshAllData();
  };

  // ==========================================
  // TIMELINE CRUD
  // ==========================================
  const saveMilestone = async (milestoneData) => {
    const isNew = !milestoneData.id;
    const url = isNew 
      ? `${API_BASE_URL}/timeline` 
      : `${API_BASE_URL}/timeline/${milestoneData.id}`;
    const method = isNew ? 'POST' : 'PUT';

    const response = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(camelToSnake(milestoneData))
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to save milestone.');
    }

    const data = await response.json();
    await refreshAllData();
    return data;
  };

  const deleteMilestone = async (id) => {
    const response = await fetch(`${API_BASE_URL}/timeline/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to delete milestone.');
    }

    await refreshAllData();
  };

  // ==========================================
  // TESTIMONIALS CRUD
  // ==========================================
  const saveTestimonial = async (testimonialData) => {
    const isNew = !testimonialData.id;
    const url = isNew 
      ? `${API_BASE_URL}/testimonials` 
      : `${API_BASE_URL}/testimonials/${testimonialData.id}`;
    const method = isNew ? 'POST' : 'PUT';

    const response = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(camelToSnake(testimonialData))
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to save testimonial.');
    }

    const data = await response.json();
    await refreshAllData();
    return data;
  };

  const deleteTestimonial = async (id) => {
    const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to delete testimonial.');
    }

    await refreshAllData();
  };

  const value = {
    districts,
    projects,
    timeline,
    testimonials,
    loading,
    error,
    usingFallback,
    refreshData: refreshAllData,
    saveProject,
    deleteProject,
    saveDistrict,
    deleteDistrict,
    saveMilestone,
    deleteMilestone,
    saveTestimonial,
    deleteTestimonial
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
