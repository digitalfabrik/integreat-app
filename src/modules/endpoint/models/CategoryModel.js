// @flow

class CategoryModel {
  _id: number
  _url: string
  _title: string
  _content: string
  _parentId: number
  _parentUrl: string
  _thumbnail: string
  _order: number
  _availableLanguages: Map<string, string>

  constructor (obj: {| id: number, url: string, title: string, content: string, parentId: number, thumbnail: string,
    parentUrl: string, order: number, availableLanguages: Map<string, string> |}) {
    this._id = obj.id
    this._url = obj.url
    this._title = obj.title
    this._content = obj.content
    this._parentId = obj.parentId
    this._parentUrl = obj.parentUrl
    this._thumbnail = obj.thumbnail
    this._order = obj.order
    this._availableLanguages = obj.availableLanguages
  }

  get thumbnail (): string {
    return this._thumbnail
  }

  get id (): number {
    return this._id
  }

  get url (): string {
    return this._url
  }

  get title (): string {
    return this._title
  }

  get content (): string {
    return this._content
  }

  get parentId (): number {
    return this._parentId
  }

  get parentUrl (): string {
    return this._parentUrl
  }

  setParentUrl (parentUrl: string) {
    this._parentUrl = parentUrl
  }

  get order (): number {
    return this._order
  }

  get availableLanguages (): Map<string, string> {
    return this._availableLanguages
  }
}

export default CategoryModel
