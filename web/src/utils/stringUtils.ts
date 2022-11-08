/**
 * @param path: a slash-prefixed path
 * @returns {string} the url of the current host and the specified path
 */
export const urlFromPath = (path: string): string => `${window.location.origin}${path}`

/**
 * @param path: the current path
 * @returns {string} the parent of the current path
 */
export const getParentPath = (path: string): string => path.replace(/[^/]*$/, '').replace(/\/$/, '')
