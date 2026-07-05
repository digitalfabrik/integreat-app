import sanitizeHtml from 'sanitize-html'

export const sanitizeContent = (content: string, options: { supportedIframeSources?: string[] }): string => {
  if (!content) {
    return ''
  }

  const { supportedIframeSources } = options

  return sanitizeHtml(content, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['iframe', 'img', 'details', 'summary']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      iframe: ['src', 'title', 'width', 'height', 'allow', 'allowfullscreen', 'loading', 'style'],
      img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading', 'style'],
      '*': ['class', 'style', 'dir', 'aria-*', 'data-*'],
    },
    ...(supportedIframeSources && supportedIframeSources.length > 0
      ? { allowedIframeHostnames: supportedIframeSources }
      : {}),
  })
}
