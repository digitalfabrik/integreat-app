import React, { ReactElement, ReactNode } from 'react'
import { Helmet } from 'react-helmet'
import { BreadcrumbList, WithContext } from 'schema-dts'

const createJsonLd = (breadcrumbs: Array<BreadcrumbModel>): WithContext<BreadcrumbList> =>
  // https://developers.google.com/search/docs/data-types/breadcrumb
  ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.title,
      item: breadcrumb.link,
    })),
  })

export class BreadcrumbModel {
  _title: string
  _node: ReactNode
  _link: string

  /**
   * @param title: the title of the breadcrumb
   * @param link: the URL linking to the item.
   * @param node: the displayed node of the breadcrumb
   */
  constructor({ title, link, node }: { title: string; link: string; node: React.ReactNode }) {
    this._title = title
    this._link = link
    this._node = node
  }

  get title(): string {
    return this._title
  }

  get link(): string {
    return this._link
  }

  get node(): React.ReactNode {
    return this._node
  }
}

type PropsType = {
  breadcrumbs: Array<BreadcrumbModel>
}

const JsonLdBreadcrumbs = ({ breadcrumbs }: PropsType): ReactElement => (
  <Helmet>
    <script type='application/ld+json'>{JSON.stringify(createJsonLd(breadcrumbs))}</script>
  </Helmet>
)

export default JsonLdBreadcrumbs
