import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'
import { API_VERSION } from '../constants'
import { ChatMessages, mapChatMessages } from '../mapping/mapChatMessages'
import { CHAT_ENDPOINT_NAME } from './createSendChatMessageEndpoint'

type ParamsType = {
  city: string
  language: string
  deviceId: string
}

export default (baseUrl: string): Endpoint<ParamsType, ChatMessages> =>
  new EndpointBuilder<ParamsType, ChatMessages>(CHAT_ENDPOINT_NAME)
    .withParamsToUrlMapper(
      (params: ParamsType): string =>
        `${baseUrl}/api/${API_VERSION}/${params.city}/${params.language}/${CHAT_ENDPOINT_NAME}/${params.deviceId}/`,
    )
    .withMapper(mapChatMessages)
    .build()
