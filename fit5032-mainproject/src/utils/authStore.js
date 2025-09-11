const USERS_KEY = 'yw_users'            // [{id,email,password,role}]
const SESSION_KEY = 'yw_session'        // {userId}

function loadUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || [] } catch { return [] }
}
function saveUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)) }

export function getSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)) } catch { return null }
}
export function setSession(sess) { localStorage.setItem(SESSION_KEY, JSON.stringify(sess)) }
export function clearSession() { localStorage.removeItem(SESSION_KEY) }

export function register({ email, password, role = 'user' }) {
  const users = loadUsers()
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('Email already registered.')
  }
  // NOTE: demo only — in real apps never store raw passwords.
  const user = { id: Date.now(), email, password, role }
  users.push(user); saveUsers(users)
  setSession({ userId: user.id })
  return user
}

export function login({ email, password }) {
  const users = loadUsers()
  const user = users.find(u =>
    u.email.toLowerCase() === email.toLowerCase() && u.password === password
  )
  if (!user) throw new Error('Invalid email or password.')
  setSession({ userId: user.id })
  return user
}

export function logout() { clearSession() }

export function currentUser() {
  const sess = getSession(); if (!sess) return null
  return (loadUsers().find(u => u.id === sess.userId) || null)
}

export function requireRole(roles = []) {
  const u = currentUser()
  if (!u) return { ok:false, reason:'unauthenticated' }
  if (roles.length && !roles.includes(u.role)) return { ok:false, reason:'unauthorised' }
  return { ok:true, user:u }
}
