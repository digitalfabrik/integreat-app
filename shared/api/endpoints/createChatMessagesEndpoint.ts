import Endpoint from '../Endpoint.js'
import EndpointBuilder from '../EndpointBuilder.js'
import { API_VERSION } from '../constants/index.js'
import { ChatMessagesReturn, mapChatMessages } from '../mapping/mapChatMessages.js'
import { CHAT_ENDPOINT_NAME } from './createSendChatMessageEndpoint.js'

type ParamsType = {
  regionCode: string
  language: string
  deviceId: string
}

export default (baseUrl: string): Endpoint<ParamsType, ChatMessagesReturn> =>
  new EndpointBuilder<ParamsType, ChatMessagesReturn>(CHAT_ENDPOINT_NAME)
    .withParamsToUrlMapper(
      (params: ParamsType): string =>
        `${baseUrl}/api/${API_VERSION}/${params.regionCode}/${params.language}/${CHAT_ENDPOINT_NAME}/${params.deviceId}/`,
    )
    .withMapper(mapChatMessages)
    .build()
