import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

type Props = {
  value: string
  size?: number
  label: string
}

export function QrImage({ value, size = 160, label }: Props) {
  const [dataUrl, setDataUrl] = useState<string | null>(null)

  useEffect(() => {
    let isCurrent = true
    QRCode.toDataURL(value, { width: size * 2, margin: 1, color: { dark: '#0f2b25', light: '#fffcf5' } })
      .then((url) => {
        if (isCurrent) setDataUrl(url)
      })
      .catch(() => {
        if (isCurrent) setDataUrl(null)
      })
    return () => {
      isCurrent = false
    }
  }, [value, size])

  if (!dataUrl) return <div style={{ width: size, height: size }} className="rounded-lg bg-edge/50" aria-hidden="true" />

  return <img src={dataUrl} width={size} height={size} alt={label} className="rounded-lg" />
}
