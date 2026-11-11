export const BESCHEID_CHECK_FALLBACK_REGION_CODE = 'bescheid-check'

export const ANALYSIS_STAGES = {
  ocr: 'scanning',
  translate: 'translating',
  classify: 'evaluating',
  extraction: 'preparing',
} as const

export const ANALYSIS_STEPS = ['uploading', ...Object.values(ANALYSIS_STAGES)] as const

export type BescheidCheckProgressStatus = (typeof ANALYSIS_STEPS)[number] | 'done'

export type BescheidCheckResult = {
  classification: { type: string; confidence: number; reason: string }
  explanation: { title: string; content: string; url: string } | null
  counseling: { question: string; counselingName: string; region: string } | null
  pages: { pageNumber: number; originalHtml: string; translatedHtml: string }[]
}
