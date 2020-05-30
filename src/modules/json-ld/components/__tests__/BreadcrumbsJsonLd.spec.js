// @flow

import React from 'react'
import { shallow } from 'enzyme'

import BreadcrumbsJsonLd from '../BreadcrumbsJsonLd'
import BreadcrumbModel from '../../../common/BreadcrumbModel'
import { Helmet } from 'react-helmet'

describe('BreadcrumbsJsonLd', () => {
  it('should output valid json-ld', () => {
    const wrapper = shallow(
      <BreadcrumbsJsonLd breadcrumbs={[
        new BreadcrumbModel({ title: 'Home', link: '/', node: <a href='/'>Home</a> }),
        new BreadcrumbModel({ title: 'Subcategory', link: '/sub', node: <a href='/sub'>Subcategory</a> }),
        new BreadcrumbModel({ title: 'ThisSite', link: '/sub/current', node: <a href='/sub/current'>ThisSite</a> })
      ]} />)

    const helmet = wrapper.find(Helmet)
    expect(helmet.children().matchesElement(<script type='application/ld+json'>
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [{
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: '/'
          }, {
            '@type': 'ListItem',
            position: 2,
            name: 'Subcategory',
            item: '/sub'
          }, {
            '@type': 'ListItem',
            position: 3,
            name: 'ThisSite',
            item: '/sub/current'
          }]
        })}
      </script>
    )).toBe(true)
  })
})
