import { ANALYSIS_STAGES, BescheidCheckResult } from '../../constants/bescheidCheck.ts'
import FetchError from '../errors/FetchError.ts'
import ResponseError from '../errors/ResponseError.ts'
import readServerEvents, { ServerEvent } from '../readServerEvents.ts'
import { JsonBescheidCheckErrorType, JsonBescheidCheckResultType, JsonBescheidCheckStageType } from '../types.ts'

export const ANALYZE_BESCHEID_ENDPOINT_NAME = 'analyzeBescheid'

const ANALYSIS_TIMEOUT = 300_000

export class BescheidCheckAnalysisError extends Error {}

type BescheidCheckStage = (typeof ANALYSIS_STAGES)[keyof typeof ANALYSIS_STAGES]

const mapResult = ({
  classification,
  explanation,
  counseling,
  pages,
}: JsonBescheidCheckResultType): BescheidCheckResult => ({
  classification,
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

type AnalyzeBescheidParams = {
  baseUrl: string
  languageCode: string
  regionCode: string
  files: File[]
  onStage: (stage: BescheidCheckStage) => void
}

const analyzeBescheid = async ({
  baseUrl,
  languageCode,
  regionCode,
  files,
  onStage,
}: AnalyzeBescheidParams): Promise<BescheidCheckResult> => {
  const url = `${baseUrl}/bescheidcheck/analyze/${languageCode}/`
  const body = new FormData()
  // The backend rejects files with the same name, e.g. image.jpg for every photo of the iOS camera
  files.forEach((file, index) => body.append('files', file, `${index + 1}-${file.name}`))
  body.append('region', regionCode)
  const requestOptions = { method: 'POST', body, signal: AbortSignal.timeout(ANALYSIS_TIMEOUT) }

  let lastEvent: ServerEvent | undefined
  try {
    const response = await fetch(url, requestOptions)
    if (!response.ok || !response.body) {
      throw new ResponseError({ endpointName: ANALYZE_BESCHEID_ENDPOINT_NAME, response, url, requestOptions })
    }
    lastEvent = await readServerEvents(response.body, ({ event, data }) => {
      if (event === 'stage') {
        onStage(ANALYSIS_STAGES[(JSON.parse(data) as JsonBescheidCheckStageType).stage])
      }
    })
  } catch (error) {
    if (error instanceof ResponseError) {
      throw error
    }
    throw new FetchError({
      endpointName: ANALYZE_BESCHEID_ENDPOINT_NAME,
      innerError: error instanceof Error ? error : new Error(),
      url,
      requestOptions,
    })
  }

  if (lastEvent?.event !== 'result') {
    throw new BescheidCheckAnalysisError(
      lastEvent?.event === 'error'
        ? (JSON.parse(lastEvent.data) as JsonBescheidCheckErrorType).reason
        : 'The analysis ended without a result',
    )
  }
  return mapResult(JSON.parse(lastEvent.data) as JsonBescheidCheckResultType)
}

export default analyzeBescheid
