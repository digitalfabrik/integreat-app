import { API_VERSION } from '../../constants'
import ChatMessageModel from '../../models/ChatMessageModel'
import createChatMessagesEndpoint from '../createChatMessagesEndpoint'

describe('createChatMessagesEndpoint', () => {
  const baseUrl = 'https://example.com'
  const isTyping = false
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
      typing: isTyping,
      messages: [
        {
          id: 2,
          content: 'Informationen zu Ihrer Frage finden Sie auf folgenden Seiten:',
          user_is_author: false,
          automatic_answer: false,
        },
      ],
    }
    const chatMessageModel = endpoint.mapResponse(messageJson, params)
    expect(chatMessageModel).toEqual({
      typing: isTyping,
      messages: [
        new ChatMessageModel({
          id: 2,
          content: 'Informationen zu Ihrer Frage finden Sie auf folgenden Seiten:',
          userIsAuthor: false,
          automaticAnswer: false,
        }),
      ],
    })
  })
})
