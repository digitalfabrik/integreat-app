/**
 * @jest-environment node
 */
import FetchError from '../../errors/FetchError.ts'
import ResponseError from '../../errors/ResponseError.ts'
import analyzeBescheid, { BescheidCheckAnalysisError } from '../analyzeBescheid.ts'

const event = (name: string, data: object) => `event: ${name}\ndata: ${JSON.stringify(data)}\n\n`

const mockResponse = (chunks: string[], status = 200) => {
  const encoder = new TextEncoder()
  const body = new ReadableStream({
    start: controller => {
      chunks.forEach(chunk => controller.enqueue(encoder.encode(chunk)))
      controller.close()
    },
  })
  jest.mocked(fetch).mockResolvedValueOnce(new Response(body, { status }))
}

describe('analyzeBescheid', () => {
  const baseUrl = 'https://example.com'
  const file = new File(['content'], 'page1.pdf')
  const onStage = jest.fn()
  const params = { baseUrl, languageCode: 'ar', regionCode: 'muenchen', files: [file], onStage }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should post the files and report the stages until the result', async () => {
    mockResponse([
      event('stage', { stage: 'ocr', index: 1, status: 'started' }),
      event('stage', { stage: 'translate', index: 2, status: 'started' }),
      event('stage', { stage: 'classify', index: 3, status: 'started' }),
      event('stage', { stage: 'extraction', index: 4, status: 'started' }),
      event('result', { status: 'success' }),
    ])

    await analyzeBescheid(params)

    const formData = new FormData()
    formData.append('files', file)
    formData.append('region', 'muenchen')
    expect(fetch).toHaveBeenCalledWith(`${baseUrl}/bescheidcheck/analyze/ar/`, {
      method: 'POST',
      body: formData,
      signal: undefined,
    })
    expect(onStage.mock.calls).toEqual([['scanning'], ['translating'], ['evaluating'], ['preparing']])
  })

  it('should send files with the same name under different names', async () => {
    const append = jest.spyOn(FormData.prototype, 'append')
    const photos = [new File(['photo 1'], 'image.jpg'), new File(['photo 2'], 'image.jpg')]
    mockResponse([event('result', {})])

    await analyzeBescheid({ ...params, files: photos })

    expect(append).toHaveBeenCalledWith('files', photos[0], '1-image.jpg')
    expect(append).toHaveBeenCalledWith('files', photos[1], '2-image.jpg')
    append.mockRestore()
  })

  it('should throw if the backend reports an error', async () => {
    mockResponse([event('stage', { stage: 'ocr' }), event('error', { stage: 'ocr', reason: 'OCR failed' })])

    await expect(analyzeBescheid(params)).rejects.toThrow('OCR failed')
  })

  it('should throw if the analysis ends without a result', async () => {
    mockResponse([event('stage', { stage: 'ocr' })])

    await expect(analyzeBescheid(params)).rejects.toThrow(BescheidCheckAnalysisError)
  })

  it('should throw a fetch error if the connection drops while reading', async () => {
    const body = new ReadableStream({ start: controller => controller.error(new TypeError('network error')) })
    jest.mocked(fetch).mockResolvedValueOnce(new Response(body))

    await expect(analyzeBescheid(params)).rejects.toThrow(FetchError)
  })

  it('should throw a response error if the request is rejected', async () => {
    mockResponse([JSON.stringify({ status: 'error', reason: 'Unknown region. Please pick a valid region.' })], 404)

    await expect(analyzeBescheid(params)).rejects.toThrow(ResponseError)
  })

  it('should throw a fetch error if the request fails', async () => {
    jest.mocked(fetch).mockRejectedValueOnce(new TypeError('Failed to fetch'))

    await expect(analyzeBescheid(params)).rejects.toThrow(FetchError)
  })
})
