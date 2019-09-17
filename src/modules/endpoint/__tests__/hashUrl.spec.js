// @flow

import hashUrl from '../hashUrl'

describe('hashUrl', () => {
  it('should hash url and encode to hex', () => {
    expect(hashUrl('https://ex.am/p.l/thumbnail.png')).toBe('81a74f17bb169f4dad2f59bb2e4670f9')
  })

  it('should hash url and not encode to base64', () => {
    expect(hashUrl('https://ex.am/p.l/thumbnail.png')).not.toBe('gadPF7sWn02tL1m7LkZw+Q==')
  })
})
