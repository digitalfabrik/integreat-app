import hashUrl from '../hashUrl'
describe('hashUrl', () => {
  it('should hash url using md5 and encode to hex', () => {
    expect(hashUrl('https://ex.am/p.l/thumbnail.png')).toBe('81a74f17bb169f4dad2f59bb2e4670f9')
  })
})
