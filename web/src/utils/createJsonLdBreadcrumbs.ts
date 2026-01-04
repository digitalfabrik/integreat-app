import type { BreadcrumbList, WithContext } from 'schema-dts'

import { BreadcrumbProps } from '../components/Breadcrumb'
import { urlFromPath } from './stringUtils'

const createJsonLdBreadcrumbs = (breadcrumbs: BreadcrumbProps[]): WithContext<BreadcrumbList> =>
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

export default createJsonLdBreadcrumbs
