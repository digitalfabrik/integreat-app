class PoiCategoryModel {
  _id: number
  _name: string
  _color: string
  _icon: string
  _iconName: string

  constructor({
    id,
    name,
    color,
    icon,
    iconName,
  }: {
    id: number
    name: string
    icon: string
    iconName: string
    color: string
  }) {
    this._name = name
    this._id = id
    this._color = color
    this._icon = icon
    this._iconName = iconName
  }

  get id(): number {
    return this._id
  }

  get name(): string {
    return this._name
  }

  get color(): string {
    return this._color
  }

  get icon(): string {
    return this._icon
  }

  get iconName(): string {
    return this._iconName
  }

  isEqual(other: PoiCategoryModel): boolean {
    return (
      this.id === other.id &&
      this.name === other.name &&
      this.color === other.color &&
      this.icon === other.icon &&
      this.iconName === other.iconName
    )
  }
}

export default PoiCategoryModel
