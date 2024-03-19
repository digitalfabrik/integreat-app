type FeaturedImageInstanceType = {
  url: string
  width: number
  height: number
}

const isSameImage = (a: FeaturedImageInstanceType, b: FeaturedImageInstanceType): boolean =>
  a.url === b.url && a.width === b.width && a.height === b.height

class FeaturedImageModel {
  _description: string | null | undefined
  _thumbnail: FeaturedImageInstanceType
  _medium: FeaturedImageInstanceType
  _large: FeaturedImageInstanceType
  _full: FeaturedImageInstanceType

  constructor(params: {
    description: string | null | undefined
    thumbnail: FeaturedImageInstanceType
    medium: FeaturedImageInstanceType
    large: FeaturedImageInstanceType
    full: FeaturedImageInstanceType
  }) {
    this._description = params.description
    this._thumbnail = params.thumbnail
    this._medium = params.medium
    this._large = params.large
    this._full = params.full
  }

  get description(): string | null | undefined {
    return this._description
  }

  get thumbnail(): FeaturedImageInstanceType {
    return this._thumbnail
  }

  get medium(): FeaturedImageInstanceType {
    return this._medium
  }

  get large(): FeaturedImageInstanceType {
    return this._large
  }

  get full(): FeaturedImageInstanceType {
    return this._full
  }

  isEqual(other: FeaturedImageModel | null | undefined): boolean {
    return (
      !!other &&
      this.description === other.description &&
      isSameImage(this.thumbnail, other.thumbnail) &&
      isSameImage(this.medium, other.medium) &&
      isSameImage(this.large, other.large) &&
      isSameImage(this.full, other.full)
    )
  }
}

export default FeaturedImageModel
