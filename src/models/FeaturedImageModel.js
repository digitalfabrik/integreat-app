// @flow

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
}

export default FeaturedImageModel
