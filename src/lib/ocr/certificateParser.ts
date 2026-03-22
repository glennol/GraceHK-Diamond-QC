export interface ParsedCertificate {
  certNumber?: string
  shape?: string
  measurements?: string
  carat?: string
  color?: string
  clarity?: string
  cut?: string
  polish?: string
  symmetry?: string
  fluorescence?: string
  inscription?: string
}

export function parseCertificateText(text: string): ParsedCertificate {
  const lines = text.split('\n').map(l => l.trim())
  const find = (pattern: RegExp): string | undefined => {
    for (const line of lines) {
      const m = line.match(pattern)
      if (m) return m[1]?.trim()
    }
    return undefined
  }

  return {
    certNumber: find(/(?:report|cert(?:ificate)?|grading)[^\d]*(\d{7,12})/i),
    shape: find(/(?:shape|cut style)\s*[:\-]?\s*([A-Za-z ]+)/i),
    measurements: find(/(?:measurements?)\s*[:\-]?\s*([\d.x\s]+mm?)/i),
    carat: find(/(?:carat|weight)\s*[:\-]?\s*([\d.]+)\s*(?:ct)?/i),
    color: find(/(?:color|colour)\s*[:\-]?\s*([A-Z])\b/i),
    clarity: find(/(?:clarity)\s*[:\-]?\s*(FL|IF|VVS1|VVS2|VS1|VS2|SI1|SI2|I[123])/i),
    cut: find(/(?:cut grade?)\s*[:\-]?\s*(Excellent|Very Good|Good|Fair|Poor)/i),
    polish: find(/(?:polish)\s*[:\-]?\s*(Excellent|Very Good|Good|Fair|Poor)/i),
    symmetry: find(/(?:symmetry)\s*[:\-]?\s*(Excellent|Very Good|Good|Fair|Poor)/i),
    fluorescence: find(/(?:fluorescence?)\s*[:\-]?\s*(None|Faint|Medium|Strong|Very Strong)/i),
    inscription: find(/(?:inscription)\s*[:\-]?\s*([A-Z0-9\s]+)/i),
  }
}
