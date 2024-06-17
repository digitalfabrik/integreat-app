class ChatMessageModel {
  _id: number
  _body: string
  _userIsAuthor: boolean

  constructor(params: { id: number; body: string; userIsAuthor: boolean }) {
    const { id, body, userIsAuthor } = params
    this._id = id
    this._body = body
    this._userIsAuthor = userIsAuthor
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
}

export default ChatMessageModel
