import { DateTime } from 'luxon'

import ChatMessageModel from '../models/ChatMessageModel'
import { JsonChatMessagesType } from '../types'

export type ChatMessagesReturn = {
  botTyping: boolean
  messages: ChatMessageModel[]
}

export const mapChatMessages = (json: JsonChatMessagesType): ChatMessagesReturn => ({
  botTyping: json.chatbot_typing,
  messages: json.messages.map(
    chatMessage =>
      new ChatMessageModel({
        id: chatMessage.id,
        content: chatMessage.content,
        created: DateTime.fromISO(chatMessage.created_at),
        userIsAuthor: chatMessage.user_is_author,
        automaticAnswer: chatMessage.automatic_answer,
      }),
  ),
})
