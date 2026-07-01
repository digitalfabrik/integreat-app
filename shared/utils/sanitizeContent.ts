import sanitizeHtml from 'sanitize-html'

export const sanitizeContent = (content: string): string => {
  if (!content) {
    return ''
  }

  return sanitizeHtml(content, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['iframe', 'img', 'details', 'summary']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      iframe: ['src', 'title', 'allowfullscreen'],
      img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading'],
      '*': ['class'],
    },
    allowedIframeHostnames: ['vimeo.com'],
  })
}
