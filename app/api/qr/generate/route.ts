import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/middleware'
import { generateQRCode } from '@/lib/qr-utils'

async function handler(request: NextRequest) {
  const { type, id } = await request.json()

  if (!type || !id) {
    return Response.json({ error: 'Type and ID are required' }, { status: 400 })
  }

  try {
    const qrData = `${id}`
    const qrCodeUrl = await generateQRCode(qrData)

    return Response.json({ qrCodeUrl, data: qrData })
  } catch (error) {
    return Response.json({ error: 'Failed to generate QR code' }, { status: 500 })
  }
}

export const POST = withAuth(handler)