/**
 * Function return if path is internal or external by checking if an URL can be created that requires an absolute path
 * @param link provides absolute or relative path
 */
export const isExternalUrl = (link: string): boolean => {
  try {
    // Check whether link is a valid URL
    return !!new URL(link)
  } catch (e) {
    // Link is not a valid URL and therefore just a pathname -> internal link
    return false
  }
}
