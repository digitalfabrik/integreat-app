import { createJsonLd } from '../JsonLdBreadcrumbs'

describe('BreadcrumbsJsonLd', () => {
  const location = window.location
  it('should create correct json-ld', () => {
    const jsonLd = createJsonLd([
      {
        title: 'Home',
        to: '/',
      },
      {
        title: 'Subcategory',
        to: '/sub',
      },
      {
        title: 'ThisSite',
        to: '/sub/current',
      },
    ])

    expect(jsonLd).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${location}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Subcategory',
          item: `${location}sub`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'ThisSite',
          item: `${location}sub/current`,
        },
      ],
    })
  })
})
