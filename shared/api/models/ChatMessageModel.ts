import { DateTime } from 'luxon'

class ChatMessageModel {
  _id: number
  _content: string
  _created: DateTime
  _userIsAuthor: boolean
  _automaticAnswer: boolean

  constructor(params: {
    id: number
    content: string
    created: DateTime
    userIsAuthor: boolean
    automaticAnswer: boolean
  }) {
    const { id, content, created, userIsAuthor, automaticAnswer } = params
    this._id = id
    this._content = content
    this._created = created
    this._userIsAuthor = userIsAuthor
    this._automaticAnswer = automaticAnswer
  }

  get id(): number {
    return this._id
  }

  get content(): string {
    return this._content
  }

  get created(): DateTime {
    return this._created
  }

  get userIsAuthor(): boolean {
    return this._userIsAuthor
  }

  get isAutomaticAnswer(): boolean {
    return this._automaticAnswer
  }
}

export default ChatMessageModel
