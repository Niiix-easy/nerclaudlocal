import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    const adminPassword = process.env.STUDIO_ADMIN_PASSWORD

    if (!adminPassword) {
      console.error('STUDIO_ADMIN_PASSWORD is not set in environment variables')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    if (password === adminPassword) {
      const cookieStore = await cookies()
      cookieStore.set('neercloud_admin_auth', 'authenticated', {
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
