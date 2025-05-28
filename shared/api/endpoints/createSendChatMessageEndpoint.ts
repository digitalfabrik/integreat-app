import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'
import { API_VERSION } from '../constants'
import { ChatMessagesReturn, mapChatMessages } from '../mapping/mapChatMessages'

export const CHAT_ENDPOINT_NAME = 'chat'
type ParamsType = {
  cityCode: string
  language: string
  deviceId: string
  message: string
}

export default (baseUrl: string): Endpoint<ParamsType, ChatMessagesReturn> =>
  new EndpointBuilder<ParamsType, ChatMessagesReturn>(CHAT_ENDPOINT_NAME)
    .withParamsToUrlMapper(
      (params: ParamsType): string =>
        `${baseUrl}/api/${API_VERSION}/${params.cityCode}/${params.language}/${CHAT_ENDPOINT_NAME}/${params.deviceId}/`,
    )
    .withParamsToBodyMapper((params: ParamsType): FormData => {
      const { message } = params
      const formData = new FormData()
      formData.append('message', message)
      return formData
    })
    .withMapper(mapChatMessages)
    .build()
