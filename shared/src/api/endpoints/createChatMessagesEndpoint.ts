import Endpoint from '../Endpoint.ts'
import EndpointBuilder from '../EndpointBuilder.ts'
import { API_VERSION } from '../constants/index.ts'
import { ChatMessagesReturn, mapChatMessages } from '../mapping/mapChatMessages.ts'
import { CHAT_ENDPOINT_NAME } from './createSendChatMessageEndpoint.ts'

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
