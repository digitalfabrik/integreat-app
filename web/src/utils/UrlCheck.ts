import buildConfig from '../constants/buildConfig'

/**
 * Function return if path is internal or external by checking if an URL can be created that requires an absolute path
 * @param link provides absolute or relative path
 */
export const isExternalUrl = (link: string): boolean => {
  const InternalLinkRegexp = new RegExp(buildConfig().internalLinksHijackPattern)
  try {
    // Check whether link is a valid URL
    // eslint-disable-next-line no-new
    new URL(link)
    return !InternalLinkRegexp.test(link)
  } catch (e) {
    // Link is not a valid URL and therefore just a pathname -> internal link
    return false
  }
}
