// @flow

import React from 'react'
import { Helmet } from 'react-helmet'
import BreadcrumbModel from '../../common/BreadcrumbModel'

const createJsonLd = (breadcrumbs: Array<BreadcrumbModel>) => {
  // https://developers.google.com/search/docs/data-types/breadcrumb
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.title,
      item: breadcrumb.link
    }))
  }
}

type PropsType = {|
  breadcrumbs: Array<BreadcrumbModel>
|}

class BreadcrumbsJsonLd extends React.Component<PropsType> {
  render() {
    return (
      <Helmet>
        <script type='application/ld+json'>{JSON.stringify(createJsonLd(this.props.breadcrumbs))}</script>
      </Helmet>
    )
  }
}

export default BreadcrumbsJsonLd
