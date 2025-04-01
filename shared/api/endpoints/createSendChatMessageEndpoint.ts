import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'
import { API_VERSION } from '../constants'
import ChatMessageModel from '../models/ChatMessageModel'
import { JsonChatMessagesType } from '../types'

export const CHAT_ENDPOINT_NAME = 'chat'
type ParamsType = {
  city: string
  language: string
  deviceId: string
  message: string
}

export default (baseUrl: string): Endpoint<ParamsType, ChatMessageModel[]> =>
  new EndpointBuilder<ParamsType, ChatMessageModel[]>(CHAT_ENDPOINT_NAME)
    .withParamsToUrlMapper(
      (params: ParamsType): string =>
        `${baseUrl}/api/${API_VERSION}/${params.city}/${params.language}/${CHAT_ENDPOINT_NAME}/${params.deviceId}/`,
    )
    .withParamsToBodyMapper((params: ParamsType): FormData => {
      const { message } = params
      const formData = new FormData()
      formData.append('message', message)
      return formData
    })
    .withMapper((json: JsonChatMessagesType): ChatMessageModel[] =>
      json.messages.map(
        chatMessage =>
          new ChatMessageModel({
            id: chatMessage.id,
            content: chatMessage.content,
            userIsAuthor: chatMessage.user_is_author,
            automaticAnswer: chatMessage.automatic_answer,
          }),
      ),
    )
    .build()
