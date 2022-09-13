import React from 'react'

import BreadcrumbModel from '../../models/BreadcrumbModel'
import { createJsonLd } from '../JsonLdBreadcrumbs'

describe('BreadcrumbsJsonLd', () => {
  const location = window.location
  it('should create correct json-ld', () => {
    const jsonLd = createJsonLd([
      new BreadcrumbModel({
        title: 'Home',
        pathname: '/',
        node: <a href='/'>Home</a>,
      }),
      new BreadcrumbModel({
        title: 'Subcategory',
        pathname: '/sub',
        node: <a href='/sub'>Subcategory</a>,
      }),
      new BreadcrumbModel({
        title: 'ThisSite',
        pathname: '/sub/current',
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
