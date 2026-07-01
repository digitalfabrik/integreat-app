import { API_VERSION } from '../../constants/index.js'
import createSendChatMessageEndpoint from '../createSendChatMessageEndpoint.js'

describe('createSendChatMessageEndpoint', () => {
  const baseUrl = 'https://example.com'
  const params = {
    regionCode: 'augsburg',
    languageCode: 'fa',
    chatId: '23123-dsasd1-2dsa12',
    message: 'Ich habe eine Frage',
  }
  const endpoint = createSendChatMessageEndpoint(baseUrl)
  it('should map params to url', () => {
    expect(endpoint.mapParamsToUrl(params)).toBe(
      `${baseUrl}/api/${API_VERSION}/${params.regionCode}/${params.languageCode}/chat/${params.chatId}/`,
    )
  })

  it('should map the params to the body', () => {
    const formData = new FormData()
    formData.append('message', params.message)
    expect(endpoint.mapParamsToBody).not.toBeNull()
    expect(endpoint.mapParamsToBody).toBeDefined()
    if (!endpoint.mapParamsToBody) {
      throw new Error('Chat Session Check for Typescript failed - Check your test')
    }
    expect(
      endpoint.mapParamsToBody({
        regionCode: 'augsburg',
        languageCode: 'fa',
        chatId: params.chatId,
        message: params.message,
      }),
    ).toEqual(formData)
  })
})
