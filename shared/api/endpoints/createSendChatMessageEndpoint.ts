import Endpoint from '../Endpoint.js'
import EndpointBuilder from '../EndpointBuilder.js'
import { API_VERSION } from '../constants/index.js'
import { ChatMessagesReturn, mapChatMessages } from '../mapping/mapChatMessages.js'

export const CHAT_ENDPOINT_NAME = 'chat'

type ParamsType = {
  regionCode: string
  language: string
  deviceId: string
  message: string
}

export default (baseUrl: string): Endpoint<ParamsType, ChatMessagesReturn> =>
  new EndpointBuilder<ParamsType, ChatMessagesReturn>(CHAT_ENDPOINT_NAME)
    .withParamsToUrlMapper(
      (params: ParamsType): string =>
        `${baseUrl}/api/${API_VERSION}/${params.regionCode}/${params.language}/${CHAT_ENDPOINT_NAME}/${params.deviceId}/`,
    )
    .withParamsToBodyMapper((params: ParamsType): FormData => {
      const { message } = params
      const formData = new FormData()
      formData.append('message', message)
      return formData
    })
    .withMapper(mapChatMessages)
    .build()
