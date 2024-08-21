/**
 * @param path: a slash-prefixed path
 * @returns {string} the url of the current host and the specified path
 */
export const urlFromPath = (path: string): string => `${window.location.origin}${path}`

export const spacesToDashes = (text: string): string => text.split(' ').join('-')
