class PoiCategoryModel {
  _id: number
  _name: string
  _color?: string
  _icon?: string

  constructor({ id, name, color, icon }: { id: number; name: string; icon?: string; color?: string }) {
    this._icon = icon
    this._name = name
    this._id = id
    this._color = color
  }

  get id(): number {
    return this._id
  }

  get name(): string {
    return this._name
  }

  get color(): string | undefined {
    return this._color
  }

  get icon(): string | undefined {
    return this._icon
  }
}

export default PoiCategoryModel