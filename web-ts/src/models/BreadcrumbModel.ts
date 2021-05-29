import { ReactNode } from 'react'

export default class BreadcrumbModel {
  _title: string
  _node: ReactNode
  _link: string

  /**
   * @param title: the title of the breadcrumb
   * @param link: the URL linking to the item.
   * @param node: the displayed node of the breadcrumb
   */
  constructor({ title, link, node }: { title: string; link: string; node: ReactNode }) {
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

  get node(): ReactNode {
    return this._node
  }
}
