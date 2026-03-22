import Tesseract from 'tesseract.js'

export interface OCRRunResult {
  text: string
  confidence: number
}

export async function runOCR(
  imageData: string | HTMLImageElement | ImageData,
  onProgress?: (p: number) => void
): Promise<OCRRunResult> {
  const result = await Tesseract.recognize(imageData, 'eng', {
    logger: (m) => {
      if (m.status === 'recognizing text' && onProgress) {
        onProgress(Math.round(m.progress * 100))
      }
    },
  })
  return {
    text: result.data.text,
    confidence: result.data.confidence,
  }
}
