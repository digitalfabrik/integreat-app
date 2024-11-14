class ChatMessageModel {
  _id: number
  _body: string
  _userIsAuthor: boolean
  _automaticAnswer: boolean

  constructor(params: { id: number; body: string; userIsAuthor: boolean; automaticAnswer: boolean }) {
    const { id, body, userIsAuthor, automaticAnswer } = params
    this._id = id
    this._body = body
    this._userIsAuthor = userIsAuthor
    this._automaticAnswer = automaticAnswer
  }

  get id(): number {
    return this._id
  }

  get body(): string {
    return this._body
  }

  get userIsAuthor(): boolean {
    return this._userIsAuthor
  }

  get isAutomaticAnswer(): boolean {
    return this._automaticAnswer
  }
}

export default ChatMessageModel
