export const BESCHEID_ENDPOINT_URL = 'https://igchat-test.tuerantuer.org'

export const ANALYSIS_STAGES = {
  ocr: 'scanning',
  translate: 'translating',
  classify: 'evaluating',
  extraction: 'preparing',
} as const

export const ANALYSIS_STEPS = ['uploading', ...Object.values(ANALYSIS_STAGES)] as const

export type BescheidCheckProgressStatus = (typeof ANALYSIS_STEPS)[number] | 'done'

export const RESIDENCE_STATUSES = ['noResidenceTitle', 'residenceTitle', 'germanCitizenship'] as const
export const AGE_GROUPS = ['under18', 'from18To25', 'from26'] as const
