export const LOCAL_STORAGE_ITEM_CHAT_MESSAGES = 'Chat-Device-Id'

export const chatIdKey = (cityCode: string): string => `${LOCAL_STORAGE_ITEM_CHAT_MESSAGES}-${cityCode}`

export const generateChatId = (): string => globalThis.crypto.randomUUID()
