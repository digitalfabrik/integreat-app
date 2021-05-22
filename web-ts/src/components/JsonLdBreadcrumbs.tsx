import React, { ReactNode } from 'react'
import { Helmet } from 'react-helmet'
import BreadcrumbModel from 'web/src/modules/common/BreadcrumbModel'
import { BreadcrumbList, WithContext } from 'schema-dts'

const createJsonLd = (breadcrumbs: Array<BreadcrumbModel>): WithContext<BreadcrumbList> => {
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

type PropsType = {
  breadcrumbs: Array<BreadcrumbModel>
}

const JsonLdBreadcrumbs = ({ breadcrumbs }: PropsType) => (
  <Helmet>
    <script type='application/ld+json'>{JSON.stringify(createJsonLd(breadcrumbs))}</script>
  </Helmet>
)

export default JsonLdBreadcrumbs
