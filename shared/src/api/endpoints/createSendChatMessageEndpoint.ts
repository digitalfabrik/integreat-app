import Endpoint from '../Endpoint.js'
import EndpointBuilder from '../EndpointBuilder.js'
import { API_VERSION } from '../constants/index.js'
import { ChatMessagesReturn, mapChatMessages } from '../mapping/mapChatMessages.js'

export const CHAT_ENDPOINT_NAME = 'chat'

type ParamsType = {
  regionCode: string
  languageCode: string
  chatId: string
  message: string
}

export default (baseUrl: string): Endpoint<ParamsType, ChatMessagesReturn> =>
  new EndpointBuilder<ParamsType, ChatMessagesReturn>(CHAT_ENDPOINT_NAME)
    .withParamsToUrlMapper(
      (params: ParamsType): string =>
        `${baseUrl}/api/${API_VERSION}/${params.regionCode}/${params.languageCode}/${CHAT_ENDPOINT_NAME}/${params.chatId}/`,
    )
    .withParamsToBodyMapper((params: ParamsType): FormData => {
      const { message } = params
      const formData = new FormData()
      formData.append('message', message)
      return formData
    })
    .withMapper(mapChatMessages)
    .build()
