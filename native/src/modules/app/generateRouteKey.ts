// @flow

// This code is adopted from: https://github.com/react-navigation/react-navigation-core/blob/c85a22d78a50e853632a11036ce562e4e1ecb523/src/routers/KeyGenerator.ts
const uniqueBaseId: string = `route-id-${Date.now()}`
let uuidCount: number = 0

export const generateKey = (): string => `${uniqueBaseId}-${uuidCount++}`
