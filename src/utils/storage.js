const KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  ROLE: 'role',
  PERMISSIONS: 'permissions',
};

export const storage = {
  getAccessToken: () => localStorage.getItem(KEYS.ACCESS_TOKEN),
  setAccessToken: (token) => localStorage.setItem(KEYS.ACCESS_TOKEN, token),
  
  getRefreshToken: () => localStorage.getItem(KEYS.REFRESH_TOKEN),
  setRefreshToken: (token) => localStorage.setItem(KEYS.REFRESH_TOKEN, token),
  
  getUser: () => {
    try {
      const data = localStorage.getItem(KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setUser: (user) => localStorage.setItem(KEYS.USER, JSON.stringify(user)),
  
  getRole: () => {
    try {
      const data = localStorage.getItem(KEYS.ROLE);
      return data ? (typeof data === 'string' && data.startsWith('{') ? JSON.parse(data) : data) : null;
    } catch {
      return localStorage.getItem(KEYS.ROLE);
    }
  },
  setRole: (role) => {
    if (typeof role === 'object' && role !== null) {
      localStorage.setItem(KEYS.ROLE, JSON.stringify(role));
    } else {
      localStorage.setItem(KEYS.ROLE, role || '');
    }
  },
  
  getPermissions: () => {
    try {
      const data = localStorage.getItem(KEYS.PERMISSIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  setPermissions: (permissions) => localStorage.setItem(KEYS.PERMISSIONS, JSON.stringify(permissions || [])),
  
  setAuthData: ({ accessToken, refreshToken, user, role, permissions }) => {
    if (accessToken) localStorage.setItem(KEYS.ACCESS_TOKEN, accessToken);
    if (refreshToken) localStorage.setItem(KEYS.REFRESH_TOKEN, refreshToken);
    if (user) localStorage.setItem(KEYS.USER, JSON.stringify(user));
    if (role) {
      if (typeof role === 'object') {
        localStorage.setItem(KEYS.ROLE, JSON.stringify(role));
      } else {
        localStorage.setItem(KEYS.ROLE, role);
      }
    }
    if (permissions) localStorage.setItem(KEYS.PERMISSIONS, JSON.stringify(permissions));
  },
  
  clearAuthData: () => {
    localStorage.removeItem(KEYS.ACCESS_TOKEN);
    localStorage.removeItem(KEYS.REFRESH_TOKEN);
    localStorage.removeItem(KEYS.USER);
    localStorage.removeItem(KEYS.ROLE);
    localStorage.removeItem(KEYS.PERMISSIONS);
  },
};
