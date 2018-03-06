// @flow

type categoryModel = {
  id: number,
  url: string,
  title: string,
  parentId: number,
  parentUrl: string,
  content: string,
  thumbnail: string,
  order: number,
  availableLanguages: any
}

class CategoryModel {
   _id: number
  _url: string
  _title: string
  _parentId: number
  _parentUrl: string
  _content: string
  _thumbnail: string
  _order: number
  _availableLanguages: any

  constructor (categoryModel: categoryModel) {
    this._id = categoryModel.id
    this._url = categoryModel.url
    this._title = categoryModel.title
    this._content = categoryModel.content
    this._parentId = categoryModel.parentId
    this._parentUrl = categoryModel.parentUrl
    this._thumbnail = categoryModel.thumbnail
    this._order = categoryModel.order
    this._availableLanguages = categoryModel.availableLanguages
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

  get availableLanguages (): any {
    return this._availableLanguages
  }
}

export default CategoryModel
