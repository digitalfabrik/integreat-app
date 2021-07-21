import featuredImageToSrcSet from '../featuredImageToSrcSet'
import { FeaturedImageModel } from 'api-client'

describe('featuredImageToSrcSet', () => {
  it('should calculate the correct sizes for srcSet and encode urls', () => {
    const srcSet = featuredImageToSrcSet(
      new FeaturedImageModel({
        description: 'Beschreibung',
        thumbnail: { url: 'thumbnail ', width: 10, height: 15 },
        medium: { url: 'medium', width: 20, height: 30 },
        large: { url: 'large', width: 30, height: 45 },
        full: { url: 'full', width: 40, height: 60 }
      }),
      20
    )

    expect(srcSet).toEqual('thumbnail%20 0.5x, medium 1x, large 1.5x, full 2x')
  })
})
