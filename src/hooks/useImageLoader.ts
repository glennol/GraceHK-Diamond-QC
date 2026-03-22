import { useState, useCallback } from 'react'
import { fileToDataUrl } from '@/lib/images/imageUtils'

export function useImageLoader() {
  const [dataUrl, setDataUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const load = useCallback(async (file: File) => {
    setLoading(true)
    try {
      const url = await fileToDataUrl(file)
      setDataUrl(url)
    } finally {
      setLoading(false)
    }
  }, [])

  return { dataUrl, loading, load, clear: () => setDataUrl(null) }
}
