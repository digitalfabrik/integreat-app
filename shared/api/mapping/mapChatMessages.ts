import { DateTime } from 'luxon'

import ChatMessageModel from '../models/ChatMessageModel.js'
import { JsonChatMessagesType } from '../types.js'

export type ChatMessagesReturn = {
  botTyping: boolean
  messages: ChatMessageModel[]
  ticketUrl: string
}

export const mapChatMessages = (json: JsonChatMessagesType): ChatMessagesReturn => ({
  botTyping: json.chatbot_typing,
  ticketUrl: json.ticket_url,
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
