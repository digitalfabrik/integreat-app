const CHAT_ID_STORAGE_KEY = 'Chat-Device-Id'
const CHAT_SEEN_MESSAGE_COUNT_STORAGE_KEY = 'Chat-Seen-Message-Count'

export const chatIdKey = (regionCode: string): string => `${CHAT_ID_STORAGE_KEY}-${regionCode}`

export const chatSeenMessagesKey = (regionCode: string): string =>
  `${CHAT_SEEN_MESSAGE_COUNT_STORAGE_KEY}-${regionCode}`

export const generateChatId = (): string => globalThis.crypto.randomUUID()
