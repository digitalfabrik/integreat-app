import { DateTime } from 'luxon'

export type SerializedChatMessage = {
  id: number
  content: string
  created: string
  userIsAuthor: boolean
  automaticAnswer: boolean
  synced: boolean
}

class ChatMessageModel {
  _id: number
  _content: string
  _created: DateTime
  _userIsAuthor: boolean
  _automaticAnswer: boolean
  _synced: boolean

  constructor(params: {
    id: number
    content: string
    created: DateTime
    userIsAuthor: boolean
    automaticAnswer: boolean
    synced?: boolean
  }) {
    const { id, content, created, userIsAuthor, automaticAnswer, synced = true } = params
    this._id = id
    this._content = content
    this._created = created
    this._userIsAuthor = userIsAuthor
    this._automaticAnswer = automaticAnswer
    this._synced = synced
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

  get synced(): boolean {
    return this._synced
  }

  serialize = (): SerializedChatMessage => ChatMessageModel.serialize(this)

  static serialize = (message: ChatMessageModel): SerializedChatMessage => ({
    id: message.id,
    content: message.content,
    created: message.created.toISO(),
    userIsAuthor: message.userIsAuthor,
    automaticAnswer: message.isAutomaticAnswer,
    synced: message.synced,
  })

  static deserialize = (json: SerializedChatMessage): ChatMessageModel =>
    new ChatMessageModel({ ...json, created: DateTime.fromISO(json.created) })

  static unsyncedMessage = (content: string): SerializedChatMessage => ({
    id: DateTime.now().toMillis(),
    content,
    created: DateTime.now().toISO(),
    userIsAuthor: true,
    automaticAnswer: false,
    synced: false,
  })
}

export default ChatMessageModel
