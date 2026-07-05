import { sanitizeContent } from '../sanitizeContent.js'

describe('sanitizeContent', () => {
  const allowedIframes = ['vimeo.com']

  it('should keep the iframe attributes', () => {
    const sanitizedContent = sanitizeContent('<iframe title="vimeo" src="https://vimeo.com"/>', {
      supportedIframeSources: allowedIframes,
    })
    expect(sanitizedContent).toContain('<iframe title="vimeo" src="https://vimeo.com"></iframe>')
  })

  it('should strip iframe from a non-supported host', () => {
    const out = sanitizeContent('<iframe title="x" src="https://test.example"></iframe>', {
      supportedIframeSources: ['vimeo.com'],
    })
    expect(out).not.toContain('<iframe title="x" src="https://test.example"></iframe>')
  })

  it('should remove script tags', () => {
    const sanitizedContent = sanitizeContent('<script>alert(1)</script><p>ok</p>', {
      supportedIframeSources: allowedIframes,
    })
    expect(sanitizedContent).not.toContain('<script>alert(1)</script>')
    expect(sanitizedContent).toContain('<p>ok</p>')
  })

  it('should remove inline event handlers', () => {
    const sanitizedContent = sanitizeContent('<img src="x" onerror="alert(1)">', {
      supportedIframeSources: allowedIframes,
    })
    expect(sanitizedContent).not.toContain('onerror')
    expect(sanitizedContent).not.toContain('alert')
  })

  it('should remove event handlers even on allowed iframe', () => {
    const sanitizedContent = sanitizeContent('<iframe title="x" src="https://vimeo.com" onload="alert(1)"/>', {
      supportedIframeSources: allowedIframes,
    })
    expect(sanitizedContent).not.toContain('onload')
    expect(sanitizedContent).toContain('<iframe title="x" src="https://vimeo.com"></iframe>')
  })

  it('should keep img with its attributes', () => {
    const sanitizedContent = sanitizeContent(
      '<img src="https://example.com/pic.png" alt="a picture" width="100" height="80"/>',
      { supportedIframeSources: allowedIframes },
    )
    expect(sanitizedContent).toContain('<img')
    expect(sanitizedContent).toContain('src="https://example.com/pic.png"')
    expect(sanitizedContent).toContain('alt="a picture"')
    expect(sanitizedContent).toContain('width="100"')
    expect(sanitizedContent).toContain('height="80"')
  })

  it('should keep details/summary', () => {
    const sanitizedContent = sanitizeContent('<details><summary>more</summary><p>body</p></details>', {
      supportedIframeSources: allowedIframes,
    })
    expect(sanitizedContent).toContain('<details>')
    expect(sanitizedContent).toContain('<summary>')
  })

  it('should keep class and inline style on any element', () => {
    expect(
      sanitizeContent('<p class="test" style="color: rgb(0, 0, 0)">text</p>', {
        supportedIframeSources: allowedIframes,
      }),
    ).toContain('<p class="test" style="color:rgb(0, 0, 0)">text</p>')
  })

  it('should keep dir on elements', () => {
    const sanitizedContent = sanitizeContent('<span dir="rtl">test</span>', { supportedIframeSources: allowedIframes })
    expect(sanitizedContent).toContain('dir="rtl"')
  })

  it('should keep aria-* attributes', () => {
    const sanitizedContent = sanitizeContent('<div aria-label="Close">x</div>', {
      supportedIframeSources: allowedIframes,
    })
    expect(sanitizedContent).toContain('aria-label="Close"')
  })

  it('should keep data-* attributes', () => {
    const sanitizedContent = sanitizeContent('<div data-testid="widget" data-source="cms">x</div>', {
      supportedIframeSources: allowedIframes,
    })
    expect(sanitizedContent).toContain('data-testid="widget"')
    expect(sanitizedContent).toContain('data-source="cms"')
  })
})
