import { Moment } from 'moment'
import { parseHTML } from '../utils/helpers'

class LocalNewsModel {
  _id: number
  _timestamp: Moment
  _title: string
  _message: string

  constructor(params: { id: number; timestamp: Moment; title: string; message: string }) {
    const { id, timestamp, title, message } = params

    const parsedTitle = parseHTML(title)
    const parsedMessage = parseHTML(message)

    this._id = id
    this._timestamp = timestamp
    this._title = parsedTitle
    this._message = parsedMessage
  }

  get timestamp(): Moment {
    return this._timestamp
  }

  get title(): string {
    return this._title
  }

  get message(): string {
    return this._message
  }

  get id(): number {
    return this._id
  }
}

export default LocalNewsModel
