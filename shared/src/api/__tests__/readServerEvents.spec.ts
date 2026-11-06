/**
 * @jest-environment node
 */
import readServerEvents from '../readServerEvents.ts'

const streamOf = (chunks: string[]): ReadableStream<BufferSource> => {
  const encoder = new TextEncoder()
  return new ReadableStream<BufferSource>({
    start: controller => {
      chunks.forEach(chunk => controller.enqueue(encoder.encode(chunk)))
      controller.close()
    },
  })
}

describe('readServerEvents', () => {
  const onEvent = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call onEvent for every event and return the last one', async () => {
    const lastEvent = await readServerEvents(
      streamOf(['event: stage\ndata: {"stage": "ocr"}\n\n', 'event: result\ndata: {}\n\n']),
      onEvent,
    )

    expect(onEvent.mock.calls).toEqual([
      [{ event: 'stage', data: '{"stage": "ocr"}' }],
      [{ event: 'result', data: '{}' }],
    ])
    expect(lastEvent).toEqual({ event: 'result', data: '{}' })
  })

  it('should read events split across chunks', async () => {
    const lastEvent = await readServerEvents(streamOf(['event: sta', 'ge\ndata: {}', '\n\n']), onEvent)

    expect(onEvent).toHaveBeenCalledTimes(1)
    expect(lastEvent).toEqual({ event: 'stage', data: '{}' })
  })

  it('should return undefined if the stream has no events', async () => {
    expect(await readServerEvents(streamOf([]), onEvent)).toBeUndefined()
    expect(onEvent).not.toHaveBeenCalled()
  })
})
