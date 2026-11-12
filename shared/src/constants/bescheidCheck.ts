export const ANALYSIS_STAGES = {
  ocr: 'scanning',
  translate: 'translating',
  classify: 'evaluating',
  extraction: 'preparing',
} as const

export const ANALYSIS_STEPS = ['uploading', ...Object.values(ANALYSIS_STAGES)] as const

export type BescheidCheckProgressStatus = (typeof ANALYSIS_STEPS)[number] | 'done'
