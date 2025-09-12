// src/utils/authStore.js
// Demo-only auth store: LocalStorage users + session
// Now stores password *hash* (SHA-256) instead of plaintext,
// and includes backward-compat migration for old plaintext records.

const USERS_KEY = 'yw_users'      // [{id,email,passwordHash,role}]  (old: password)
const SESSION_KEY = 'yw_session'  // { userId }

// ---------- helpers ----------
function loadUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || [] } catch { return [] }
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}
export function getSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)) } catch { return null }
}
export function setSession(sess) { localStorage.setItem(SESSION_KEY, JSON.stringify(sess)) }
export function clearSession() { localStorage.removeItem(SESSION_KEY) }

// Native Web Crypto hash (demo only; real apps: salted hash server-side)
async function sha256(text) {
  const enc = new TextEncoder().encode(text)
  const buf = await crypto.subtle.digest('SHA-256', enc)
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

// Normalize email (trim + lowercase)
function normEmail(email = '') {
  return String(email).trim().toLowerCase()
}

// ---------- public API ----------
export async function register({ email, password, role = 'user' }) {
  const users = loadUsers()
  const e = normEmail(email)
  if (users.some(u => normEmail(u.email) === e)) {
    throw new Error('Email already registered.')
  }
  // Store hash instead of plaintext (demo)
  const passwordHash = await sha256(password)
  const user = { id: Date.now(), email: e, passwordHash, role }
  users.push(user); saveUsers(users)
  setSession({ userId: user.id })
  return user
}

/**
 * Backward-compat login:
 * - If user has passwordHash → compare hash(password) with stored hash
 * - If user has old plaintext password → accept once, migrate to hash and remove plaintext
 */
export async function login({ email, password }) {
  const users = loadUsers()
  const e = normEmail(email)
  const user = users.find(u => normEmail(u.email) === e)
  if (!user) throw new Error('Invalid email or password.')

  // Preferred path: compare hashes
  if (user.passwordHash) {
    const hash = await sha256(password)
    if (user.passwordHash !== hash) throw new Error('Invalid email or password.')
  } else if (user.password) {
    // Legacy record (plaintext). Allow once, then migrate to hash.
    if (user.password !== password) throw new Error('Invalid email or password.')
    user.passwordHash = await sha256(password)
    delete user.password
    saveUsers(users)
  } else {
    throw new Error('Invalid email or password.')
  }

  setSession({ userId: user.id })
  return user
}

export function logout() { clearSession() }

export function currentUser() {
  const sess = getSession(); if (!sess) return null
  return (loadUsers().find(u => u.id === sess.userId) || null)
}

/**
 * Role guard: pass an array of roles to allow, e.g. ['user','admin'] or ['admin']
 * Returns { ok: boolean, reason?: 'unauthenticated' | 'unauthorised', user?: object }
 */
export function requireRole(roles = []) {
  const u = currentUser()
  if (!u) return { ok: false, reason: 'unauthenticated' }
  if (roles.length && !roles.includes(u.role)) return { ok: false, reason: 'unauthorised' }
  return { ok: true, user: u }
}
