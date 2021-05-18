import { Moment } from 'moment'

class TunewsModel {
  _id: number
  _title: string
  _tags: Array<string>
  _date: Moment
  _content: string
  _eNewsNo: string

  constructor(params: {
    id: number
    title: string
    date: Moment
    tags: Array<string>
    content: string
    eNewsNo: string
  }) {
    const { id, date, title, tags, content, eNewsNo } = params
    this._id = id
    this._title = title
    this._tags = tags
    this._date = date
    this._content = content
    this._eNewsNo = eNewsNo
  }

  get id(): number {
    return this._id
  }

  get title(): string {
    return this._title
  }

  get date(): Moment {
    return this._date
  }

  get tags(): Array<string> {
    return this._tags
  }

  get content(): string {
    return this._content
  }

  get eNewsNo(): string {
    return this._eNewsNo
  }
}

export default TunewsModel
