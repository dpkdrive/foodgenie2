/* Client-side JWT utilities (no secret needed — just decode payload) */

export interface TokenPayload {
  id:    string
  email: string
  role:  string
  exp:   number
  iat:   number
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

export function isTokenValid(token: string | null): boolean {
  if (!token) return false
  const payload = decodeToken(token)
  if (!payload) return false
  return payload.exp * 1000 > Date.now()
}

export function getToken(): string | null {
  return localStorage.getItem('fg_token')
}

export function getAdminInfo(): TokenPayload | null {
  const token = getToken()
  if (!token || !isTokenValid(token)) return null
  return decodeToken(token)
}

export function authHeaders(): Record<string, string> {
  const token = getToken()
  return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' }
}

export function clearAuth() {
  localStorage.removeItem('fg_token')
}
