import { API_VERSION } from '../../constants'
import createSendChatMessageEndpoint from '../createSendChatMessageEndpoint'

describe('createSendChatMessageEndpoint', () => {
  const baseUrl = 'https://example.com'
  const params = {
    cityCode: 'augsburg',
    language: 'fa',
    deviceId: '23123-dsasd1-2dsa12',
    message: 'Ich habe eine Frage',
  }
  const endpoint = createSendChatMessageEndpoint(baseUrl)
  it('should map params to url', () => {
    expect(endpoint.mapParamsToUrl(params)).toBe(
      `${baseUrl}/api/${API_VERSION}/${params.cityCode}/${params.language}/chat/${params.deviceId}/`,
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
        cityCode: 'augsburg',
        language: 'fa',
        deviceId: params.deviceId,
        message: params.message,
      }),
    ).toEqual(formData)
  })
})
