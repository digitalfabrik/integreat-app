import { CHAT_ID_STORAGE_KEY } from '../hooks/useLocalStorage'

export const chatIdKey = (regionCode: string): string => `${CHAT_ID_STORAGE_KEY}-${regionCode}`

export const generateChatId = (): string => globalThis.crypto.randomUUID()
