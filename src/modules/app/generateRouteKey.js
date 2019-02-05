// @flow

const uniqueBaseId: string = `category-route-id-${Date.now()}`
let uuidCount: number = 0

export const generateKey = (): string => `${uniqueBaseId}-${uuidCount++}`
