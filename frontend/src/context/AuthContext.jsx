import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '../services/api.js';

const AuthContext = createContext(null);
const AUTH_STORAGE_KEY = 'veloce_auth_session';
const TOKEN_KEY = 'veloce_access_token';

function normalizeUser(raw) {
  if (!raw) return null;
  return {
    ...raw,
    fullName: raw.name || raw.fullName || '',
    name: raw.name || raw.fullName || '',
    addresses: Array.isArray(raw.addresses) ? raw.addresses : [],
    seedsBalance: Number(raw.seedsBalance || 0),
    seedHistory: Array.isArray(raw.seedHistory) ? raw.seedHistory : [],
    tier: raw.tier || 'Sprout Patron',
  };
}

function persistSession(token, rawUser) {
  const user = normalizeUser(rawUser);
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  return user;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshRewards = async () => {
    const response = await apiClient('/rewards/me');
    const rewardData = response.data || {};
    const entries = Array.isArray(rewardData.entries) ? rewardData.entries : [];
    setUser((previous) => previous ? ({
      ...previous,
      seedsBalance: Number(rewardData.totalPoints || 0),
      seedHistory: entries.map((entry) => ({
        id: entry.id,
        title: entry.action,
        date: entry.createdAt,
        seeds: entry.points,
        type: entry.points < 0 ? 'spent' : 'earned',
      })),
    }) : previous);
    return rewardData;
  };

  const playDailyGame = async () => {
    const response = await apiClient('/rewards/game/play', { method: 'POST' });
    await refreshRewards();
    return response;
  };

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setIsLoading(false);
      return () => { active = false; };
    }
    apiClient('/auth/me')
      .then((response) => {
        if (!active) return;
        const fresh = normalizeUser(response.data?.user);
        setUser(fresh);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(fresh));
        apiClient('/rewards/me').then((rewards) => {
          if (!active) return;
          const data = rewards.data || {};
          const entries = Array.isArray(data.entries) ? data.entries : [];
          setUser((previous) => previous ? ({ ...previous, seedsBalance: Number(data.totalPoints || 0), seedHistory: entries.map((entry) => ({ id: entry.id, title: entry.action, date: entry.createdAt, seeds: entry.points, type: entry.points < 0 ? 'spent' : 'earned' })) }) : previous);
        }).catch((error) => console.warn('Rewards ledger unavailable:', error.message));
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        if (active) setUser(null);
      })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  const finishAuth = (response) => {
    if (!response?.data?.token || !response?.data?.user) throw new Error('The server returned an incomplete authentication response.');
    const nextUser = persistSession(response.data.token, response.data.user);
    setUser(nextUser);
    refreshRewards().catch((error) => console.warn('Rewards ledger unavailable:', error.message));
    return nextUser;
  };

  const login = async ({ identifier, email, password }) => {
    const loginEmail = String(email || identifier || '').trim().toLowerCase();
    if (!loginEmail.includes('@')) throw new Error('Please sign in using the registered email address.');
    const response = await apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: loginEmail, password }),
    });
    return finishAuth(response);
  };

  const signup = async ({ fullName, name, email, phone, password, referralCode }) => {
    const response = await apiClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: String(name || fullName || '').trim(),
        email: String(email || '').trim().toLowerCase(),
        phone: String(phone || '').trim(),
        password,
        ...(referralCode ? { referralCode: String(referralCode).trim() } : {}),
      }),
    });
    return finishAuth(response);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  };

  const updateProfile = async (fields) => {
    const response = await apiClient('/auth/me', {
      method: 'PATCH',
      body: JSON.stringify({ name: fields.fullName ?? fields.name, phone: fields.phone, city: fields.city }),
    });
    const updated = normalizeUser(response.data?.user);
    setUser((previous) => ({ ...previous, ...updated }));
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ ...user, ...updated }));
    return updated;
  };

  // These local helpers keep existing non-checkout UI widgets compatible.
  // Persistent reward balances are read from /api/rewards/me; local-only game
  // animations must not be treated as server-credited points.
  const addSeeds = (amount, title = 'Engagement activity') => setUser((previous) => previous ? ({
    ...previous,
    seedsBalance: (previous.seedsBalance || 0) + Number(amount || 0),
    seedHistory: [{ id: `local-${Date.now()}`, title, date: 'Today', seeds: Number(amount || 0), type: 'earned' }, ...(previous.seedHistory || [])],
  }) : previous);
  const deductSeeds = (amount, title = 'Reward redemption') => setUser((previous) => previous ? ({
    ...previous,
    seedsBalance: Math.max(0, (previous.seedsBalance || 0) - Number(amount || 0)),
    seedHistory: [{ id: `local-${Date.now()}`, title, date: 'Today', seeds: -Number(amount || 0), type: 'spent' }, ...(previous.seedHistory || [])],
  }) : previous);
  const addAddress = (address) => setUser((previous) => previous ? ({ ...previous, addresses: [...(previous.addresses || []), { ...address, id: `addr-${Date.now()}` }] }) : previous);
  const deleteAddress = (id) => setUser((previous) => previous ? ({ ...previous, addresses: (previous.addresses || []).filter((item) => item.id !== id) }) : previous);
  const updateAddress = (id, fields) => setUser((previous) => previous ? ({ ...previous, addresses: (previous.addresses || []).map((item) => item.id === id ? { ...item, ...fields } : item) }) : previous);
  const setDefaultAddress = (id) => setUser((previous) => previous ? ({ ...previous, addresses: (previous.addresses || []).map((item) => ({ ...item, isDefault: item.id === id })) }) : previous);

  const value = {
    user,
    isAuthenticated: Boolean(user && localStorage.getItem(TOKEN_KEY)),
    isLoading,
    refreshRewards,
    playDailyGame,
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
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
export default AuthContext;