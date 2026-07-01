import { sanitizeContent } from '../sanitizeContent.js'

const cleanHTML = (input: string): string => sanitizeContent(input)

describe('sanitizeContent', () => {
  it('should keep the iframe attributes', () => {
    const sanitizedContent = cleanHTML('<iframe title="vimeo" src="https://vimeo.com"></iframe>')
    expect(sanitizedContent).toContain('<iframe title="vimeo" src="https://vimeo.com"></iframe>')
  })

  it('should remove script tags', () => {
    expect(cleanHTML('<script>alert(1)</script><p>ok</p>')).not.toContain('<script')
  })

  it('should remove inline event handlers', () => {
    const sanitizedContent = cleanHTML('<img src="x" onerror="alert(1)">')
    expect(sanitizedContent).not.toContain('onerror')
    expect(sanitizedContent).not.toContain('alert')
  })

  it('should remove event handlers even on allowed iframe', () => {
    const sanitizedContent = cleanHTML('<iframe title="x" src="https://vimeo.com" onload="alert(1)"></iframe>')
    expect(sanitizedContent).not.toContain('onload')
    expect(sanitizedContent).toContain('<iframe')
  })

  it('keeps the img with its attributes', () => {
    const sanitizedContent = cleanHTML(
      '<img src="https://example.com/pic.png" alt="a picture" width="100" height="80"/>',
    )
    expect(sanitizedContent).toContain('<img')
    expect(sanitizedContent).toContain('src="https://example.com/pic.png"')
    expect(sanitizedContent).toContain('alt="a picture"')
    expect(sanitizedContent).toContain('width="100"')
    expect(sanitizedContent).toContain('height="80"')
  })

  it('should keep details/summary', () => {
    const sanitizedContent = cleanHTML('<details><summary>more</summary><p>body</p></details>')
    expect(sanitizedContent).toContain('<details>')
    expect(sanitizedContent).toContain('<summary>')
  })

  it('should keep class on any element', () => {
    expect(sanitizeContent('<p class="test">x</p>')).toContain('class="test"')
  })
})
