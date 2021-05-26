import normalizePath from 'normalize-path'

const normalize = (value: string) => decodeURIComponent(normalizePath(value))

export default normalize
