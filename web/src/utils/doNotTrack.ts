// Vimeo supports do not track
export const addDoNotTrackParameter = (iframe: HTMLIFrameElement): void => {
  if (iframe.src.includes('vimeo')) {
    const url = new URL(iframe.src)
    url.searchParams.append('dnt', '1')
    iframe.setAttribute('src', url.href)
  }
}
