import Endpoint from '../Endpoint.js'
import EndpointBuilder from '../EndpointBuilder.js'
import { API_VERSION } from '../constants/index.js'
import { ChatMessagesReturn, mapChatMessages } from '../mapping/mapChatMessages.js'
import { CHAT_ENDPOINT_NAME } from './createSendChatMessageEndpoint.js'

type ParamsType = {
  regionCode: string
  languageCode: string
  chatId: string
}

export default (baseUrl: string): Endpoint<ParamsType, ChatMessagesReturn> =>
  new EndpointBuilder<ParamsType, ChatMessagesReturn>(CHAT_ENDPOINT_NAME)
    .withParamsToUrlMapper(
      (params: ParamsType): string =>
        `${baseUrl}/api/${API_VERSION}/${params.regionCode}/${params.languageCode}/${CHAT_ENDPOINT_NAME}/${params.chatId}/`,
    )
    .withMapper(mapChatMessages)
    .build()
