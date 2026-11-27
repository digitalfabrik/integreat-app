import { DateTime } from 'luxon'

import { ANALYSIS_STAGES, BESCHEID_ENDPOINT_URL } from '../../constants/bescheidCheck.ts'
import FetchError from '../errors/FetchError.ts'
import ResponseError from '../errors/ResponseError.ts'
import readServerEvents from '../readServerEvents.ts'
import { JsonBescheidCheckErrorType, JsonBescheidCheckResultType, JsonBescheidCheckStageType } from '../types.ts'

export const ANALYZE_BESCHEID_ENDPOINT_NAME = 'analyzeBescheid'

const ANALYSIS_TIMEOUT = 300_000

export class BescheidCheckAnalysisError extends Error {}

type BescheidCheckStage = (typeof ANALYSIS_STAGES)[keyof typeof ANALYSIS_STAGES]

export type BescheidCheckResult = {
  classification: { type: string; confidence: number; reason: string }
  topic: string | null
  consequences: string[]
  actionRequired: boolean
  deadline: { date: DateTime | null } | null
  explanation: { title: string; content: string; url: string } | null
  counseling: { question: string; counselingName: string; region: string } | null
  pages: { pageNumber: number; originalHtml: string; translatedHtml: string }[]
}

const mapDeadlineDate = (deadlineDate: string | null | undefined): DateTime | null => {
  const date = deadlineDate ? DateTime.fromISO(deadlineDate) : null
  return date?.isValid ? date : null
}

const mapResult = ({
  classification,
  extracted_data: extractedData,
  explanation,
  counseling,
  pages,
}: JsonBescheidCheckResultType): BescheidCheckResult => ({
  classification,
  topic: extractedData.topic ?? null,
  consequences: extractedData.consequences ?? [],
  actionRequired: !!extractedData.required_action,
  deadline: extractedData.deadline_detected ? { date: mapDeadlineDate(extractedData.deadline_date) } : null,
  explanation,
  counseling: counseling && {
    question: counseling.question,
    counselingName: counseling.counseling_name,
    region: counseling.region,
  },
  pages: pages.map(page => ({
    pageNumber: page.page_no,
    originalHtml: page.original_html,
    translatedHtml: page.translated_html,
  })),
})

// Returns a signal that aborts as soon as the passed signal aborts or the timeout is reached.
const withTimeout = (signal: AbortSignal | undefined, timeout: number): AbortSignal => {
  const controller = new AbortController()
  const abort = () => controller.abort()
  AbortSignal.timeout(timeout).addEventListener('abort', abort)
  signal?.addEventListener('abort', abort)
  return controller.signal
}

type AnalyzeBescheidParams = {
  languageCode: string
  regionCode: string
  files: File[]
  onStage: (stage: BescheidCheckStage) => void
  signal?: AbortSignal
}

const analyzeBescheid = async ({
  languageCode,
  regionCode,
  files,
  onStage,
  signal,
}: AnalyzeBescheidParams): Promise<BescheidCheckResult> => {
  const url = `${BESCHEID_ENDPOINT_URL}/bescheidcheck/analyze/${languageCode}/`
  const body = new FormData()
  // The backend rejects files with the same name, e.g. image.jpg for every photo of the iOS camera
  files.forEach((file, index) => body.append('files', file, `${index + 1}-${file.name}`))
  body.append('region', regionCode)
  const requestOptions = { method: 'POST', body, signal: withTimeout(signal, ANALYSIS_TIMEOUT) }

  const throwFetchError = (error: unknown): never => {
    const innerError = error instanceof Error ? error : new Error()
    throw new FetchError({ endpointName: ANALYZE_BESCHEID_ENDPOINT_NAME, innerError, url, requestOptions })
  }

  const response = await fetch(url, requestOptions).catch(throwFetchError)
  if (!response.ok || !response.body) {
    throw new ResponseError({ endpointName: ANALYZE_BESCHEID_ENDPOINT_NAME, response, url, requestOptions })
  }
  const lastEvent = await readServerEvents(response.body, ({ event, data }) => {
    if (event === 'stage') {
      const { stage }: JsonBescheidCheckStageType = JSON.parse(data)
      onStage(ANALYSIS_STAGES[stage])
    }
  }).catch(throwFetchError)

  if (lastEvent?.event === 'result') {
    const result: JsonBescheidCheckResultType = JSON.parse(lastEvent.data)
    return mapResult(result)
  }
  if (lastEvent?.event === 'error') {
    const { reason }: JsonBescheidCheckErrorType = JSON.parse(lastEvent.data)
    throw new BescheidCheckAnalysisError(reason)
  }
  throw new BescheidCheckAnalysisError('The analysis ended without a result')
}

export default analyzeBescheid
