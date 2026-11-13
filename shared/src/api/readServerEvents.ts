export type ServerEvent = {
  event: string
  data: string
}

const parseServerEvent = (text: string): ServerEvent => {
  const lines = text.split('\n')
  const getField = (name: string) => lines.find(line => line.startsWith(`${name}: `))?.slice(name.length + 2) ?? ''
  return { event: getField('event'), data: getField('data') }
}

const readChunks = async (
  reader: ReadableStreamDefaultReader<string>,
  onEvent: (event: ServerEvent) => void,
  buffer = '',
  lastEvent?: ServerEvent,
): Promise<ServerEvent | undefined> => {
  const { done, value } = await reader.read()
  if (done) {
    return lastEvent
  }
  // Events are separated by an empty line and can be split across chunks
  const texts = `${buffer}${value}`.split('\n\n')
  const incompleteText = texts.pop() ?? ''
  const events = texts.map(parseServerEvent)
  events.forEach(event => onEvent(event))
  return readChunks(reader, onEvent, incompleteText, events[events.length - 1] ?? lastEvent)
}

// Calls onEvent for every event of the stream and returns the last one
const readServerEvents = (
  stream: ReadableStream<BufferSource>,
  onEvent: (event: ServerEvent) => void,
): Promise<ServerEvent | undefined> => readChunks(stream.pipeThrough(new TextDecoderStream()).getReader(), onEvent)

export default readServerEvents
