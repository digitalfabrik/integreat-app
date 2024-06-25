import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'
import { API_VERSION } from '../constants'
import ChatMessageModel from '../models/ChatMessageModel'
import { JsonChatMessagesType } from '../types'
import { CHAT_ENDPOINT_NAME } from './createSendChatMessageEndpoint'

type ParamsType = {
  city: string
  language: string
  deviceId: string
}

export default (baseUrl: string): Endpoint<ParamsType, Array<ChatMessageModel>> =>
  new EndpointBuilder<ParamsType, Array<ChatMessageModel>>(CHAT_ENDPOINT_NAME)
    .withParamsToUrlMapper(
      (params: ParamsType): string =>
        `${baseUrl}/api/${API_VERSION}/${params.city}/${params.language}/${CHAT_ENDPOINT_NAME}/${params.deviceId}/`,
    )
    .withMapper(
      (json: JsonChatMessagesType): Array<ChatMessageModel> =>
        json.messages.map(
          chatMessage =>
            new ChatMessageModel({
              id: chatMessage.id,
              body: chatMessage.body,
              userIsAuthor: chatMessage.user_is_author,
            }),
        ),
    )
    .build()
