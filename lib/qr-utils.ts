import QRCode from 'qrcode'
import crypto from 'crypto'

// Require secret from environment
const SECRET_PASSPHRASE = process.env.ENCRYPTION_SECRET || 'super_secret_passphrase'
if (!SECRET_PASSPHRASE) {
  throw new Error("ENCRYPTION_SECRET is not set in environment variables")
}

const SECRET_KEY = crypto.createHash('sha256').update(SECRET_PASSPHRASE).digest()
const IV_LENGTH = 16

function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv('aes-256-cbc', SECRET_KEY, iv)
  let encrypted = cipher.update(text, 'utf8', 'base64')
  encrypted += cipher.final('base64')
  return `${iv.toString('base64')}:${encrypted}` // IV + ciphertext
}

function decrypt(encryptedData: string): string {
  const [ivBase64, encryptedText] = encryptedData.split(':', 2)
  if (!ivBase64 || !encryptedText) {
    throw new Error("Invalid encrypted QR format")
  }
  const iv = Buffer.from(ivBase64, 'base64')
  const decipher = crypto.createDecipheriv('aes-256-cbc', SECRET_KEY, iv)
  let decrypted = decipher.update(encryptedText, 'base64', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

export async function generateQRCode(data: string): Promise<string> {
  try {
    const encrypted = encrypt(data) // Encrypt before encoding
    return await QRCode.toDataURL(encrypted)
  } catch (error) {
    console.error("QR generation failed:", error)
    throw error
  }
}

// Parse only after decryption
export function parseQRData(encryptedData: string): { type: 'user' | 'book', id: string } | null {
  try {
    console.log(encryptedData)
    const decrypted = decrypt(encryptedData)
    console.log(decrypted)
    if (decrypted.startsWith('USER:')) {
      return { type: 'user', id: decrypted.replace('USER:', '') }
    }
    if (decrypted.startsWith('BOOK:')) {
      return { type: 'book', id: decrypted.replace('BOOK:', '') }
    }
    return null
  } catch (err) {
    console.error("QR parse failed:", err)
    return null
  }
}