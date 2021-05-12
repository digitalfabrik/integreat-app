// @flow

import React from 'react'
import { shallow } from 'enzyme'

import BreadcrumbsJsonLd from '../BreadcrumbsJsonLd'
import BreadcrumbModel from '../../../common/BreadcrumbModel'
import { Helmet } from 'react-helmet'

describe('BreadcrumbsJsonLd', () => {
  it('should output valid json-ld', () => {
    const wrapper = shallow(
      <BreadcrumbsJsonLd
        breadcrumbs={[
          new BreadcrumbModel({
            title: 'Home',
            link: 'https://abc.xyz/',
            node: <a href='/'>Home</a>
          }),
          new BreadcrumbModel({
            title: 'Subcategory',
            link: 'https://abc.xyz/sub',
            node: <a href='/sub'>Subcategory</a>
          }),
          new BreadcrumbModel({
            title: 'ThisSite',
            link: 'https://abc.xyz/sub/current',
            node: <a href='/sub/current'>ThisSite</a>
          })
        ]}
      />
    )

    const helmet = wrapper.find(Helmet)
    expect(
      helmet.children().matchesElement(
        <script type='application/ld+json'>
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://abc.xyz/'
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Subcategory',
                item: 'https://abc.xyz/sub'
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: 'ThisSite',
                item: 'https://abc.xyz/sub/current'
              }
            ]
          })}
        </script>
      )
    ).toBe(true)
  })
})
