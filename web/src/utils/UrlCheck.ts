export const isExternalUrl = (link: string): boolean => {
  // If it is possible to create a URL from the link, it is an absolute and therefore an external url
  // If it throws an error, it is relative and therefore an internal link
  // Might be refactored to URL.canParse() at a later point, got only implemented in 2023 in most browsers
  try {
    const _ = new URL(link)
    return true
  } catch (e) {
    return false
  }
}
