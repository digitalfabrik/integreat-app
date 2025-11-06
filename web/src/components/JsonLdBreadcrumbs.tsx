import React, { ReactElement } from 'react'
import { Helmet } from 'react-helmet'
import { BreadcrumbList, WithContext } from 'schema-dts'

import { urlFromPath } from '../utils/stringUtils'
import { BreadcrumbProps } from './Breadcrumb'

export const createJsonLd = (breadcrumbs: BreadcrumbProps[]): WithContext<BreadcrumbList> =>
  // https://developers.google.com/search/docs/data-types/breadcrumb
  ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.title,
      item: urlFromPath(breadcrumb.to),
    })),
  })

type JsonLdBreadcrumbsProps = {
  breadcrumbs: BreadcrumbProps[]
}

const JsonLdBreadcrumbs = ({ breadcrumbs }: JsonLdBreadcrumbsProps): ReactElement => (
  <Helmet>
    <script type='application/ld+json'>{JSON.stringify(createJsonLd(breadcrumbs))}</script>
  </Helmet>
)

export default JsonLdBreadcrumbs
