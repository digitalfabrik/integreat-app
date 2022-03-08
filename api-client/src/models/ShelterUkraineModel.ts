class ShelterUkraineModel {
  _id: number
  _title: string

  constructor(params: { id: number; title: string }) {
    this._id = params.id
    this._title = params.title
  }

  get id(): number {
    return this._id
  }

  get title(): string {
    return this._title
  }
}

export default ShelterUkraineModel
