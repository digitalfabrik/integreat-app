import { API_VERSION } from '../../constants'
import ChatMessageModel from '../../models/ChatMessageModel'
import createChatMessagesEndpoint from '../createChatMessagesEndpoint'

describe('createChatMessagesEndpoint', () => {
  const baseUrl = 'https://example.com'
  const params = {
    city: 'augsburg',
    language: 'fa',
    deviceId: '23123-dsasd1-2dsa12',
  }
  const endpoint = createChatMessagesEndpoint(baseUrl)
  it('should map params to url', () => {
    expect(endpoint.mapParamsToUrl(params)).toBe(
      `${baseUrl}/api/${API_VERSION}/${params.city}/${params.language}/chat/${params.deviceId}/`,
    )
  })

  it('should map fetched data to model', () => {
    const messageJson = {
      messages: [
        {
          id: 2,
          body: 'Informationen zu Ihrer Frage finden Sie auf folgenden Seiten:',
          user_is_author: false,
        },
      ],
    }
    const chatMessageModel = endpoint.mapResponse(messageJson, params)
    expect(chatMessageModel).toEqual([
      new ChatMessageModel({
        id: 2,
        body: 'Informationen zu Ihrer Frage finden Sie auf folgenden Seiten:',
        userIsAuthor: false,
        automaticAnswer: false,
      }),
    ])
  })
})
