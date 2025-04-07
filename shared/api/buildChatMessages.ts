import ChatMessageModel from './models/ChatMessageModel'
import { ChatMessages, JsonChatMessagesType } from './types'

export const buildChatMessages = (json: JsonChatMessagesType): ChatMessages => ({
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
