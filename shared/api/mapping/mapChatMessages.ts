import ChatMessageModel from '../models/ChatMessageModel'
import { JsonChatMessagesType } from '../types'

export type ChatMessagesReturn = {
  typing: boolean
  messages: ChatMessageModel[]
}

export const mapChatMessages = (json: JsonChatMessagesType): ChatMessagesReturn => ({
  typing: json.chatbot_typing,
  messages: json.messages.map(
    chatMessage =>
      new ChatMessageModel({
        id: chatMessage.id,
        content: chatMessage.content,
        userIsAuthor: chatMessage.user_is_author,
        automaticAnswer: chatMessage.automatic_answer,
      }),
  ),
})
