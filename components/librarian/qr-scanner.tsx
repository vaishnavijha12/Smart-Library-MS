'use client'

import { useEffect, useRef, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface QRScannerProps {
  onScan: (data: string) => void
  title?: string
}

export function QRScanner({ onScan, title = 'QR Scanner' }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)

  useEffect(() => {
    if (isScanning) {
      scannerRef.current = new Html5QrcodeScanner(
        'qr-reader',
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        false
      )

      scannerRef.current.render(
        (decodedText) => {
          onScan(decodedText)
          stopScanning()
        },
        (error) => {
          console.warn('QR scan error:', error)
        }
      )
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear()
        scannerRef.current = null
      }
    }
  }, [isScanning])

  const startScanning = () => {
    setIsScanning(true)
  }

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.clear()
      scannerRef.current = null
    }
    setIsScanning(false)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {!isScanning ? (
          <Button onClick={startScanning} className="w-full bg-zinc-800 text-white">
            Start QR Scan
          </Button>
        ) : (
          <div className="space-y-4">
            <div id="qr-reader" className="w-full"></div>
            <Button onClick={stopScanning} variant="outline" className="w-full bg-zinc-800 text-white">
              Stop Scanning
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
