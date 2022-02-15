const min = 0.05
const mid = 0.35
const max = 0.65
export const getSnapPoints = (maxHeight: number): number[] => [maxHeight * min, maxHeight * mid, maxHeight * max]
