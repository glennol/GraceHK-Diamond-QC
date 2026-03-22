import { fuzzyMatch, classifyMatch } from '@/lib/utils/compare'
import type { OCRMatchStatus } from '@/types/ocr'

export function normalizeSerial(s: string): string {
  return s.toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .replace(/O/g, '0')
    .replace(/I/g, '1')
}

export function compareInscription(ocrText: string, target: string): { status: OCRMatchStatus; score: number } {
  const normOcr = normalizeSerial(ocrText)
  const normTarget = normalizeSerial(target)
  if (!normOcr || normOcr.length < 3) return { status: 'unreadable', score: 0 }
  const score = fuzzyMatch(normOcr, normTarget)
  return { status: classifyMatch(score) as OCRMatchStatus, score }
}
