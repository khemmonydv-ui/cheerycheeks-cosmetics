import { createContext, useContext, useState, useCallback, useMemo } from 'react';

/*
 * DEMO ONLY: front-end auth stored in localStorage so you can test
 * Sign up -> Log in locally. This is NOT secure. Before going live,
 * replace signup/login with calls to your backend (e.g. Laravel API).
 */

const USERS_KEY = 'demo_admin_users';
const SESSION_KEY = 'demo_admin_session';

const AuthContext = createContext(null);

const readJSON = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

// Simple fallback hash for when crypto.subtle is unavailable
// (it only exists on https:// or http://localhost). Demo only.
function fallbackHash(text) {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < text.length; i++) {
    const ch = text.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return `f-${(h2 >>> 0).toString(16)}${(h1 >>> 0).toString(16)}`;
}

async function sha256(text) {
  if (!globalThis.crypto?.subtle) return fallbackHash(text);
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readJSON(SESSION_KEY, null));

  const signup = useCallback(async ({ name, email, password }) => {
    const users = readJSON(USERS_KEY, []);

    if (users.some((u) => u.email === email)) {
      return { ok: false, error: 'This email is already registered.' };
    }

    const passwordHash = await sha256(`${email}:${password}`);
    users.push({ name, email, passwordHash });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const session = { name, email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    return { ok: true };
  }, []);

  const login = useCallback(async (email, password) => {
    const users = readJSON(USERS_KEY, []);
    const passwordHash = await sha256(`${email}:${password}`);
    const found = users.find((u) => u.email === email && u.passwordHash === passwordHash);

    if (!found) return false;

    const session = { name: found.name, email: found.email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    return true;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    // isAdmin is kept as an alias so older components that read it keep working
    () => ({ user, isAuthenticated: !!user, isAdmin: !!user, signup, login, logout }),
    [user, signup, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}