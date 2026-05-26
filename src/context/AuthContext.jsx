import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : "https://gov-backend-production.up.railway.app/api");

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Theme & Language States
  const [language, setLanguage] = useState(
    localStorage.getItem("lang") || "ml",
  );
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleLanguage = () => {
    const nextLang = language === "en" ? "ml" : "en";
    setLanguage(nextLang);
    localStorage.setItem("lang", nextLang);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const t = (enText, mlText) => {
    return language === "en" ? enText : mlText;
  };

  // Validate session token on mount
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/user`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          // Token expired or invalid
          logoutLocal();
        }
      } catch (err) {
        console.error("Failed to validate session user:", err);
        // Do not force logout in case it is just a network glitch
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const logoutLocal = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
  };

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed. Please check credentials.",
        );
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      console.error(err);
      setError(err.message);
      throw err;
    }
  };

  const register = async (name, email, password) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error("Logout API failed:", err);
    } finally {
      logoutLocal();
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.is_admin === true;

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    API_BASE_URL,
    language,
    toggleLanguage,
    t,
    theme,
    toggleTheme,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
