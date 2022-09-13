import { ReactNode } from 'react'

export default class BreadcrumbModel {
  _title: string
  _node: ReactNode
  _pathname: string

  /**
   * @param title: the title of the breadcrumb
   * @param pathname: the pathname linking to the item.
   * @param node: the displayed node of the breadcrumb
   */
  constructor({ title, pathname, node }: { title: string; pathname: string; node: ReactNode }) {
    this._title = title
    this._pathname = pathname
    this._node = node
  }

  get title(): string {
    return this._title
  }

  get pathname(): string {
    return this._pathname
  }

  get node(): ReactNode {
    return this._node
  }
}
