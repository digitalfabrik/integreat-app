// @flow

import { isEqual } from 'lodash'

type FeaturedImageInstanceType = {|
  url: string,
  width: number,
  height: number
|}

class FeaturedImageModel {
  _description: ?string
  _thumbnail: FeaturedImageInstanceType
  _medium: FeaturedImageInstanceType
  _large: FeaturedImageInstanceType
  _full: FeaturedImageInstanceType

  constructor (params: {| description: ?string, thumbnail: FeaturedImageInstanceType,
    medium: FeaturedImageInstanceType, large: FeaturedImageInstanceType, full: FeaturedImageInstanceType |}) {
    this._description = params.description
    this._thumbnail = params.thumbnail
    this._medium = params.medium
    this._large = params.large
    this._full = params.full
  }

  get description (): ?string {
    return this._description
  }

  get thumbnail (): FeaturedImageInstanceType {
    return this._thumbnail
  }

  get medium (): FeaturedImageInstanceType {
    return this._medium
  }

  get large (): FeaturedImageInstanceType {
    return this._large
  }

  get full (): FeaturedImageInstanceType {
    return this._full
  }

  isEqual (other: ?FeaturedImageModel): boolean {
    return other && this.description === other.description &&
      isEqual(this.thumbnail, other.thumbnail) &&
      isEqual(this.medium, other.medium) &&
      isEqual(this.large, other.large) &&
      isEqual(this.full, other.full)
  }
}

export default FeaturedImageModel
