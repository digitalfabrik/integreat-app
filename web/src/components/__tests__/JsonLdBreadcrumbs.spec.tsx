import React from 'react'

import { BreadcrumbModel, createJsonLd } from '../JsonLdBreadcrumbs'

describe('BreadcrumbsJsonLd', () => {
  it('should create correct json-ld', () => {
    const jsonLd = createJsonLd([
      new BreadcrumbModel({
        title: 'Home',
        link: 'https://abc.xyz/',
        node: <a href='/'>Home</a>,
      }),
      new BreadcrumbModel({
        title: 'Subcategory',
        link: 'https://abc.xyz/sub',
        node: <a href='/sub'>Subcategory</a>,
      }),
      new BreadcrumbModel({
        title: 'ThisSite',
        link: 'https://abc.xyz/sub/current',
        node: <a href='/sub/current'>ThisSite</a>,
      }),
    ])

    expect(jsonLd).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://abc.xyz/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Subcategory',
          item: 'https://abc.xyz/sub',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'ThisSite',
          item: 'https://abc.xyz/sub/current',
        },
      ],
    })
  })
})
