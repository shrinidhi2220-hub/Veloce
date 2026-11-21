import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
const AUTH_STORAGE_KEY = 'veloce_auth_session';
const REGISTERED_USERS_KEY = 'veloce_registered_users';

export const DEMO_CREDENTIALS = {
  email: 'rahul.dev@example.com',
  phone: '9876543210',
  password: 'earthy2026'
};

export const DEFAULT_DEMO_USER = {
  id: 'usr-9281',
  fullName: 'Rahul Sharma',
  email: 'rahul.dev@example.com',
  phone: '+91 98765 43210',
  tier: 'Sage Patron',
  seedsBalance: 1450,
  joinedDate: 'November 2026',
  addresses: [
    {
      id: 'addr-1',
      title: 'Home (Default)',
      fullName: 'Rahul Sharma',
      phone: '+91 98765 43210',
      addressLine: '42, 3rd Cross, 12th Main, HAL 2nd Stage, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'India',
      isDefault: true
    },
    {
      id: 'addr-2',
      title: 'Studio Workspace',
      fullName: 'Rahul Sharma',
      phone: '+91 98765 43210',
      addressLine: 'Suite 304, Green Hub, Koramangala 4th Block',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560034',
      country: 'India',
      isDefault: false
    }
  ],
  seedHistory: [
    { id: 'sh-1', title: 'Daily Wheel of Earth Spin', date: '21 Nov 2026', seeds: 150, type: 'earned' },
    { id: 'sh-2', title: 'Eco & Craft Quiz Challenge', date: '20 Nov 2026', seeds: 200, type: 'earned' },
    { id: 'sh-3', title: 'Zero Waste Circular Pledge', date: '18 Nov 2026', seeds: 300, type: 'earned' },
    { id: 'sh-4', title: 'Patron Welcome Bonus', date: '15 Nov 2026', seeds: 500, type: 'earned' },
    { id: 'sh-5', title: 'Terracotta Vase Order Reward', date: '12 Nov 2026', seeds: 300, type: 'earned' }
  ]
};

export function AuthProvider({ children }) {
  // First-time visitors must start as logged-out (null) unless a session exists in localStorage
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(user));

  // Development helper: allow resetting stale demo sessions via URL query (?reset=true or ?logout=true)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__veloceClearSession = () => {
        logout();
        window.location.href = '/login';
      };

      if (window.location.search.includes('reset=true') || window.location.search.includes('logout=true')) {
        logout();
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, '', cleanUrl);
      }
    }
  }, []);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setIsAuthenticated(false);
      }
    } catch (e) {
      console.warn('Failed to persist auth session', e);
    }
  }, [user]);

  /**
   * Demo Login Simulation
   * Authenticates against demo credentials or previously registered mock patrons
   */
  const login = async ({ identifier, password, rememberMe = true }) => {
    // Artificial latency for tactile, realistic feedback
    await new Promise((res) => setTimeout(res, 600));

    const cleanIdentifier = (identifier || '').trim().toLowerCase();
    const cleanPhone = cleanIdentifier.replace(/\D/g, '');

    if (!cleanIdentifier || !password) {
      throw new Error('Please enter both your email/phone and password.');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    // Check against Rahul Sharma Demo Credentials
    const isDemoEmail = cleanIdentifier === DEMO_CREDENTIALS.email;
    const isDemoPhone = cleanPhone === DEMO_CREDENTIALS.phone || cleanPhone === `91${DEMO_CREDENTIALS.phone}`;

    if (isDemoEmail || isDemoPhone) {
      if (password !== DEMO_CREDENTIALS.password) {
        throw new Error('Incorrect password. For the demo patron account, use password: earthy2026');
      }
      setUser(DEFAULT_DEMO_USER);
      return DEFAULT_DEMO_USER;
    }

    // Check against registered users in localStorage
    try {
      const registered = JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || '[]');
      const found = registered.find(
        (u) =>
          u.email.toLowerCase() === cleanIdentifier ||
          u.phone.replace(/\D/g, '').endsWith(cleanPhone)
      );

      if (found) {
        // Compare password hash or check mock
        if (found.password && found.password !== password) {
          throw new Error('Incorrect password for this account. Please verify your credentials.');
        }
        const sessionUser = { ...found };
        delete sessionUser.password; // Do not keep plaintext password in active session state
        setUser(sessionUser);
        return sessionUser;
      }
    } catch (e) {
      console.warn('Error reading registered users', e);
    }

    // If identifier is a valid email/phone not found in records, create an authenticated session
    const isEmail = cleanIdentifier.includes('@');
    const newPatron = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      fullName: isEmail ? cleanIdentifier.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Conscious Patron',
      email: isEmail ? cleanIdentifier : `${cleanPhone}@patron.veloce.in`,
      phone: !isEmail ? (cleanIdentifier.startsWith('+91') ? cleanIdentifier : `+91 ${cleanPhone}`) : '+91 98765 43210',
      tier: 'Sprout Patron',
      seedsBalance: 500,
      joinedDate: 'November 2026',
      addresses: [],
      seedHistory: [
        { id: `sh-${Date.now()}`, title: 'Welcome Patron Bonus', date: 'Just now', seeds: 500, type: 'earned' }
      ]
    };

    setUser(newPatron);
    return newPatron;
  };

  /**
   * Demo Signup Simulation
   * Checks for duplicate accounts and creates a new patron session with +500 Seeds
   */
  const signup = async ({ fullName, email, phone, password }) => {
    await new Promise((res) => setTimeout(res, 700));

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPhone = (phone || '').replace(/\D/g, '');

    if (!fullName || !cleanEmail || !cleanPhone || !password) {
      throw new Error('Please fill in all required registration fields.');
    }

    // Check if registering under demo account email
    if (cleanEmail === DEMO_CREDENTIALS.email) {
      throw new Error('An account with this email address already exists. Please sign in instead.');
    }

    // Check duplicate in registered users
    let registered = [];
    try {
      registered = JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || '[]');
      const exists = registered.some((u) => u.email.toLowerCase() === cleanEmail);
      if (exists) {
        throw new Error('An account with this email address already exists. Please sign in instead.');
      }
    } catch {
      registered = [];
    }

    const newPatronRecord = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      fullName: fullName.trim(),
      email: cleanEmail,
      phone: phone.startsWith('+91') ? phone : `+91 ${cleanPhone}`,
      tier: 'Sprout Patron',
      seedsBalance: 500, // Welcome Seeds bonus
      joinedDate: 'Just now',
      addresses: [],
      password, // Stored only in mock registry for login matching simulation
      seedHistory: [
        { id: `sh-${Date.now()}`, title: 'Welcome Patron Bonus', date: 'Just now', seeds: 500, type: 'earned' }
      ]
    };

    // Save to mock users list
    try {
      registered.push(newPatronRecord);
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registered));
    } catch (e) {
      console.warn('Failed to save to mock user registry', e);
    }

    const sessionUser = { ...newPatronRecord };
    delete sessionUser.password;

    setUser(sessionUser);
    return sessionUser;
  };

  /**
   * Demo Logout
   */
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear auth session', e);
    }
  };

  /**
   * Update Profile Details
   */
  const updateProfile = (updatedFields) => {
    setUser((prev) => (prev ? { ...prev, ...updatedFields } : null));
  };

  /**
   * Update Seed Balance (Synchronized with Play & Earn and Account)
   */
  const addSeeds = (amount, activityTitle = 'Artisanal Reward') => {
    setUser((prev) => {
      if (!prev) return null;
      const newEntry = {
        id: `sh-${Date.now()}`,
        title: activityTitle,
        date: 'Today',
        seeds: amount,
        type: 'earned'
      };
      return {
        ...prev,
        seedsBalance: (prev.seedsBalance || 0) + amount,
        seedHistory: [newEntry, ...(prev.seedHistory || [])]
      };
    });
  };

  const deductSeeds = (amount, reason = 'Reward Redemption') => {
    setUser((prev) => {
      if (!prev) return null;
      const newEntry = {
        id: `sh-${Date.now()}`,
        title: reason,
        date: 'Today',
        seeds: -amount,
        type: 'spent'
      };
      return {
        ...prev,
        seedsBalance: Math.max(0, (prev.seedsBalance || 0) - amount),
        seedHistory: [newEntry, ...(prev.seedHistory || [])]
      };
    });
  };

  /**
   * Address Book Management
   */
  const addAddress = (newAddr) => {
    setUser((prev) => {
      if (!prev) return null;
      const addrWithId = { ...newAddr, id: `addr-${Date.now()}` };
      return {
        ...prev,
        addresses: [...(prev.addresses || []), addrWithId]
      };
    });
  };

  const deleteAddress = (addressId) => {
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        addresses: prev.addresses.filter((a) => a.id !== addressId)
      };
    });
  };

  const updateAddress = (addressId, updatedFields) => {
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        addresses: (prev.addresses || []).map((a) => (a.id === addressId ? { ...a, ...updatedFields } : a))
      };
    });
  };

  const setDefaultAddress = (addressId) => {
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        addresses: (prev.addresses || []).map((a) => ({
          ...a,
          isDefault: a.id === addressId
        }))
      };
    });
  };

  const value = {
    user,
    isAuthenticated,
    login,
    signup,
    logout,
    updateProfile,
    addSeeds,
    deductSeeds,
    addAddress,
    deleteAddress,
    updateAddress,
    setDefaultAddress,
    DEMO_CREDENTIALS
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
