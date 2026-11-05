export const MAX_FILES = 10
export const MAX_FILE_SIZE_MB = 20
export const BYTES_PER_MB = 1_048_576
export const ACCEPTED_FILE_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.heic']
export const ANALYSIS_TIMEOUT = 300_000
export const MAX_PROGRESS = 100

export const ANALYSIS_STEPS = ['uploading', 'scanning', 'translating', 'evaluating', 'preparing'] as const
export type BescheidCheckProgressStatus = (typeof ANALYSIS_STEPS)[number] | 'done'
