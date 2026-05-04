export const LOCAL_STORAGE_ITEM_CHAT_ID = 'Chat-Device-Id'

export const chatIdKey = (regionCode: string): string => `${LOCAL_STORAGE_ITEM_CHAT_ID}-${regionCode}`

export const generateChatId = (): string => globalThis.crypto.randomUUID()
