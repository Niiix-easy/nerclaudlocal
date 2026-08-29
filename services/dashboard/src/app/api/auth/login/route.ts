import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    const adminPassword = process.env.STUDIO_ADMIN_PASSWORD
    const sessionSecret = process.env.STUDIO_SESSION_SECRET

    if (!adminPassword || !sessionSecret) {
      console.error('STUDIO_ADMIN_PASSWORD or STUDIO_SESSION_SECRET is not set in environment variables')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    if (password === adminPassword) {
      // Secure simple token: HMAC of the string 'authenticated' with the session secret
      const token = crypto.createHmac('sha256', sessionSecret).update('authenticated').digest('hex');

      const cookieStore = await cookies()
      cookieStore.set('neercloud_admin_auth', token, {
        httpOnly: true,
        secure: false, // Ensure this works over local HTTP for ZimaOS
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 // 24 hours
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
