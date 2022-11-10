import normalizePath from 'normalize-path'

const normalize = (value: string): string => decodeURIComponent(normalizePath(value)).toLowerCase()

export default normalize
