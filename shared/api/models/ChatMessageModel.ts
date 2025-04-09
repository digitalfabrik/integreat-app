class ChatMessageModel {
  _id: number
  _content: string
  _userIsAuthor: boolean
  _automaticAnswer: boolean

  constructor(params: { id: number; content: string; userIsAuthor: boolean; automaticAnswer: boolean }) {
    const { id, content, userIsAuthor, automaticAnswer } = params
    this._id = id
    this._content = content
    this._userIsAuthor = userIsAuthor
    this._automaticAnswer = automaticAnswer
  }

  get id(): number {
    return this._id
  }

  get content(): string {
    return this._content
  }

  get userIsAuthor(): boolean {
    return this._userIsAuthor
  }

  get isAutomaticAnswer(): boolean {
    return this._automaticAnswer
  }
}

export default ChatMessageModel
