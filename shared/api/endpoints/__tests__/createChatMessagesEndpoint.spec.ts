import { DateTime } from 'luxon'

import { API_VERSION } from '../../constants'
import ChatMessageModel from '../../models/ChatMessageModel'
import createChatMessagesEndpoint from '../createChatMessagesEndpoint'

describe('createChatMessagesEndpoint', () => {
  const baseUrl = 'https://example.com'
  const params = {
    regionCode: 'augsburg',
    language: 'fa',
    deviceId: '23123-dsasd1-2dsa12',
  }
  const endpoint = createChatMessagesEndpoint(baseUrl)

  it('should map params to url', () => {
    expect(endpoint.mapParamsToUrl(params)).toBe(
      `${baseUrl}/api/${API_VERSION}/${params.regionCode}/${params.language}/chat/${params.deviceId}/`,
    )
  })

  it('should map fetched data to model', () => {
    const messageJson = {
      chatbot_typing: false,
      messages: [
        {
          id: 2,
          content: 'Informationen zu Ihrer Frage finden Sie auf folgenden Seiten:',
          created_at: '2026-03-10T10:28:00.316Z',
          user_is_author: false,
          automatic_answer: false,
        },
      ],
    }
    const chatMessageModel = endpoint.mapResponse(messageJson, params)
    expect(JSON.stringify(chatMessageModel)).toEqual(
      JSON.stringify({
        botTyping: false,
        messages: [
          new ChatMessageModel({
            id: 2,
            content: 'Informationen zu Ihrer Frage finden Sie auf folgenden Seiten:',
            created: DateTime.fromISO('2026-03-10T10:28:00.316Z'),
            userIsAuthor: false,
            automaticAnswer: false,
          }),
        ],
      }),
    )
  })
})
