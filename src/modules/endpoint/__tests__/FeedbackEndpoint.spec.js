import FeedbackEndpoint from '../FeedbackEndpoint'
import ParamMissingError from '../errors/ParamMissingError'

describe('FeedbackEndpoint', () => {
  const defaultMapParamsToUrl = params => `https://weird-endpoint/${params.var1}/${params.var2}/api.json`
  const defaultMapParamsToBody = params => {
    if (params.id === undefined) {
      throw new ParamMissingError('error', 'id')
    }

    const formData = new FormData()
    formData.append('id', `${params.id}`)

    return formData
  }

  it('should log an error if a ParamMissingError or LoadingError was thrown', async () => {
    const original = console.error
    console.error = jest.fn()

    const feedbackEndpoint = new FeedbackEndpoint('endpoint', defaultMapParamsToUrl, defaultMapParamsToBody)
    await feedbackEndpoint.postData({})

    expect(console.error).toHaveBeenCalled()

    console.error = original
  })
})
