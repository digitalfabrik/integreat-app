import React, { ReactElement } from 'react'
import { Helmet } from 'react-helmet'
import { BreadcrumbList, WithContext } from 'schema-dts'

import BreadcrumbModel from '../models/BreadcrumbModel'
import { urlFromPath } from '../utils/stringUtils'

export const createJsonLd = (breadcrumbs: Array<BreadcrumbModel>): WithContext<BreadcrumbList> =>
  // https://developers.google.com/search/docs/data-types/breadcrumb
  ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.title,
      item: urlFromPath(breadcrumb.pathname),
    })),
  })

type PropsType = {
  breadcrumbs: Array<BreadcrumbModel>
}

const JsonLdBreadcrumbs = ({ breadcrumbs }: PropsType): ReactElement => (
  <Helmet>
    <script type='application/ld+json'>{JSON.stringify(createJsonLd(breadcrumbs))}</script>
  </Helmet>
)

export default JsonLdBreadcrumbs
