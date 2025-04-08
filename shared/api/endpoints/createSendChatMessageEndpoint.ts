import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'
import { API_VERSION } from '../constants'
import { ChatMessages, mapChatMessages } from '../mapping/mapChatMessages'

export const CHAT_ENDPOINT_NAME = 'chat'
type ParamsType = {
  city: string
  language: string
  deviceId: string
  message: string
}

export default (baseUrl: string): Endpoint<ParamsType, ChatMessages> =>
  new EndpointBuilder<ParamsType, ChatMessages>(CHAT_ENDPOINT_NAME)
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
    .withMapper(mapChatMessages)
    .build()
