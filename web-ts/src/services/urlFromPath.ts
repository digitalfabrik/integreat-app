/**
 * @param path: a slash-prefixed path
 * @returns {string} the url of the current host and the specified path
 */
const urlFromPath = (path: string) => {
  return `${location.origin}${path}`
}

export default urlFromPath
