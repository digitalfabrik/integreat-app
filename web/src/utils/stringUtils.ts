/**
 * @returns {string} the url of the current host and the specified path
 * @param path
 */
export const urlFromPath = (path: string): string => `${window.location.origin}${path}`
