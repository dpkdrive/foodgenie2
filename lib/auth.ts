import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

const JWT_SECRET  = process.env.JWT_SECRET ?? 'foodgenie_dev_secret'
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN ?? '7d'

export interface JWTPayload {
  id:    string
  email: string
  role:  string
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES } as any)
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload
}

/* Middleware — call inside route handlers that need auth */
export function requireAuth(req: NextRequest): JWTPayload | NextResponse {
  const header = req.headers.get('authorization')
  if (!header?.startsWith('Bearer ')) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }
  try {
    return verifyToken(header.split(' ')[1])
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 401 })
  }
}
