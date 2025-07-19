import QRCode from 'qrcode'

export async function generateQRCode(data: string): Promise<string> {
  try {
    return await QRCode.toDataURL(data)
  } catch (error) {
    throw new Error('Failed to generate QR code')
  }
}

export function parseQRData(data: string): { type: 'user' | 'book', id: string } | null {
  try {
    if (data.startsWith('USER:')) {
      return { type: 'user', id: data.replace('USER:', '') }
    }
    if (data.startsWith('BOOK:')) {
      return { type: 'book', id: data.replace('BOOK:', '') }
    }
    return null
  } catch {
    return null
  }
}