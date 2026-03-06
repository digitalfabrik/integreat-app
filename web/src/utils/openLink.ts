/* eslint-disable @typescript-eslint/naming-convention */
import { NavigateFunction } from 'react-router'

import buildConfig from '../constants/buildConfig'

export const NEW_TAB = '_blank'
export const NEW_TAB_FEATURES = 'noreferrer'

const internalUrlRegex = new RegExp(buildConfig().internalUrlPattern)

const isInternalUrl = (url: string): boolean => internalUrlRegex.test(url)

const isRelativeInternalLink = (link: string): boolean => {
  // If it is possible to create a URL from the link, it is an absolute and therefore an external url
  // If it throws an error, it is relative and therefore an internal link
  // Might be refactored to URL.canParse() at a later point, got only implemented in 2023 in most browsers
  try {
    const _ = new URL(link)
    return false
  } catch (e) {
    // Relative and therefore internal link
    return true
  }
}

export const isInternalLink = (link: string): boolean => isRelativeInternalLink(link) || isInternalUrl(link)

const openLink = (navigate: NavigateFunction, link: string): void => {
  if (isRelativeInternalLink(link)) {
    navigate(link)
  } else if (isInternalUrl(link)) {
    const url = new URL(decodeURIComponent(link))
    navigate(decodeURIComponent(`${url.pathname}${url.search}${url.hash}`))
  } else {
    window.open(link, NEW_TAB, NEW_TAB_FEATURES)
  }
}

export default openLink
