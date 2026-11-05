import FetchError from '../errors/FetchError.ts'
import ResponseError from '../errors/ResponseError.ts'
import readServerEvents from '../readServerEvents.ts'
import { JsonBescheidCheckErrorType, JsonBescheidCheckStageType } from '../types.ts'

const ANALYZE_BESCHEID_ENDPOINT_NAME = 'analyzeBescheid'

const stages = {
  ocr: 'scanning',
  translate: 'translating',
  classify: 'evaluating',
  extraction: 'preparing',
} as const

type BescheidCheckStage = (typeof stages)[keyof typeof stages]

type AnalyzeBescheidParams = {
  baseUrl: string
  languageCode: string
  regionCode?: string
  files: File[]
  onStage: (stage: BescheidCheckStage) => void
  signal?: AbortSignal
}

const analyzeBescheid = async ({
  baseUrl,
  languageCode,
  regionCode,
  files,
  onStage,
  signal,
}: AnalyzeBescheidParams): Promise<void> => {
  const url = `${baseUrl}/bescheidcheck/analyze/${languageCode}/`
  const body = new FormData()
  // The backend rejects files with the same name, e.g. image.jpg for every photo of the iOS camera
  files.forEach((file, index) => body.append('files', file, `${index + 1}-${file.name}`))
  if (regionCode !== undefined) {
    body.append('region', regionCode)
  }
  const requestOptions = { method: 'POST', body, signal }

  const response = await fetch(url, requestOptions).catch(error => {
    throw new FetchError({ endpointName: ANALYZE_BESCHEID_ENDPOINT_NAME, innerError: error, url, requestOptions })
  })

  if (!response.ok || !response.body) {
    throw new ResponseError({ endpointName: ANALYZE_BESCHEID_ENDPOINT_NAME, response, url, requestOptions })
  }

  const lastEvent = await readServerEvents(response.body, ({ event, data }) => {
    if (event === 'stage') {
      onStage(stages[(JSON.parse(data) as JsonBescheidCheckStageType).stage])
    } else if (event === 'error') {
      throw new Error((JSON.parse(data) as JsonBescheidCheckErrorType).reason)
    }
  })

  if (lastEvent?.event !== 'result') {
    throw new Error('The analysis ended without a result')
  }
}

export default analyzeBescheid
