import { TFunction } from 'i18next'

import { CONSENT_ROUTE, ExternalSourcePermissions } from 'shared'

import { IFRAME_BLANK_SOURCE, IframeSources } from '../components/RemoteContent'

export const LOCAL_STORAGE_ITEM_EXTERNAL_SOURCES = 'Opt-In-External-Sources'
export const addDoNotTrackParameter = (iframe: HTMLIFrameElement): void => {
  if (iframe.src.includes('vimeo')) {
    const url = new URL(iframe.src)
    url.searchParams.append('dnt', '1')
    iframe.setAttribute('src', url.href)
  }
}

export const preserveIFrameSourcesFromContent = (
  index: number,
  source: string,
  setExistingIframes: (sources: IframeSources) => void,
  contentIframeSources: IframeSources,
): void => {
  const updatedContentSources: IframeSources = contentIframeSources
  updatedContentSources[index] = source
  setExistingIframes(updatedContentSources)
}

export const hideIframe = (iframe: HTMLIFrameElement): void => {
  iframe.setAttribute('src', IFRAME_BLANK_SOURCE)
  iframe.setAttribute('style', 'display:none')
}

export const restoreIframe = (iframe: HTMLIFrameElement, source: string): void => {
  iframe.setAttribute('src', source)
  iframe.setAttribute('style', 'display:block')
}

const getContainer = (element: HTMLElement, className: string, id: string): HTMLDivElement | null => {
  if (document.getElementById(id)) {
    return null
  }
  const container = document.createElement('div')
  container.id = id
  container.classList.add(className)
  element.appendChild(container)
  return container
}

const getIframeContainer = (
  id: string,
  mobile: boolean,
  iframe: HTMLIFrameElement,
  deviceWidth: number,
): HTMLDivElement => {
  const existingContainer = document.getElementById(id)
  if (existingContainer) {
    return existingContainer as HTMLDivElement
  }
  const iframeContainer = document.createElement('div')
  iframeContainer.classList.add('iframe-container')
  iframeContainer.id = id
  iframe.parentNode?.appendChild(iframeContainer)
  iframeContainer.appendChild(iframe)
  if (mobile) {
    // Scale the height depending on device width minus padding
    const padding = 16
    const scaledHeight = (deviceWidth / Number(iframe.width)) * Number(iframe.height) - padding
    iframe.setAttribute('height', `${scaledHeight}`)
  } else {
    // Set the container width according to the iframe width
    iframeContainer.setAttribute('style', `width:${iframe.width}px!important`)
  }
  return iframeContainer
}

const removeOptInContainer = (elementId: string) => {
  const element = document.getElementById(elementId)
  if (element) {
    element.remove()
  }
}

const showSource = (element: HTMLElement, source: string): void => {
  const span = document.createElement('span')
  span.classList.add('iframe-source')
  element.appendChild(span)
  span.appendChild(document.createTextNode(source))
  element.appendChild(document.createElement('br'))
}

export const showMessage = (text: string, element: HTMLDivElement, iframeSource: string): void => {
  const textNode = document.createTextNode(text)
  showSource(element, iframeSource)
  element.appendChild(textNode)
}

const showOptIn = (
  text: string,
  iframeContainer: HTMLDivElement,
  source: string,
  updateLocalStorage: (source: string) => void,
  index: number,
): void => {
  const onClickHandler = () => {
    updateLocalStorage(source)
  }

  const className = `iframe-info-text`
  const elementId = `${className}${source}${index}`
  const container = getContainer(iframeContainer, className, elementId)
  if (!container) {
    return
  }

  const id = `opt-in-checkbox-${source}${index}`
  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.name = 'opt-in-checkbox'
  checkbox.id = id
  checkbox.onclick = onClickHandler
  const label = document.createElement('label')
  showSource(label, source)
  label.htmlFor = id
  label.appendChild(document.createTextNode(text))
  container.appendChild(label)
  container.appendChild(checkbox)
}

const showSettingsLink = (element: HTMLDivElement, t: TFunction): void => {
  const link = document.createElement('a')
  link.innerHTML = t('layout:settings')
  link.id = 'opt-in-settings-link'
  link.href = `/${CONSENT_ROUTE}`
  element.appendChild(link)
}

const showMessageWithSettings = (
  text: string,
  iframeContainer: HTMLDivElement,
  t: TFunction,
  source: string,
  iframeIndex: number,
  removeOptIn: boolean,
) => {
  if (removeOptIn) {
    removeOptInContainer(`iframe-info-text${source}${iframeIndex}`)
  }
  const className = `iframe-info-text`
  const elementId = `${className}${source}${iframeIndex}`
  const container = getContainer(iframeContainer, className, elementId)
  if (!container) {
    return
  }
  iframeContainer.appendChild(container)
  showMessage(text, container, source)
  showSettingsLink(container, t)
}
export const handleAllowedIframeSources = (
  iframe: HTMLIFrameElement,
  externalSourcePermissions: ExternalSourcePermissions,
  storedIframeSource: string,
  t: TFunction,
  onUpdateLocalStorage: (source: string) => void,
  iframeIndex: number,
  supportedSource: string,
  mobile: boolean,
  deviceWidth: number,
): void => {
  const permission = supportedSource ? externalSourcePermissions[supportedSource] : undefined
  const iframeContainerId = `iframe-container${supportedSource}${iframeIndex}`
  const iframeContainer = getIframeContainer(iframeContainerId, mobile, iframe, deviceWidth)

  if (permission === undefined) {
    const message = t('consent:knownResourceOptIn')
    showOptIn(message, iframeContainer, supportedSource, onUpdateLocalStorage, iframeIndex)
  } else if (permission) {
    restoreIframe(iframe, storedIframeSource)
    // Add do not track parameter (only working for vimeo)
    if (supportedSource === 'vimeo.com') {
      addDoNotTrackParameter(iframe)
    }
    const message = t('consent:knownResourceContentMessage')
    showMessageWithSettings(message, iframeContainer, t, supportedSource, iframeIndex, true)
  } else {
    const message = t('consent:knownResourceBlocked')
    showMessageWithSettings(message, iframeContainer, t, supportedSource, iframeIndex, false)
  }
}
