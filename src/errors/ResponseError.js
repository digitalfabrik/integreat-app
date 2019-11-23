// @flow

class ResponseError extends Error {
  response: Response

  getMessage = (endpointName: string, response: Response): string =>
    `ResponseError: Failed to load the request for the ${endpointName} endpoint. Response status ${response.status}`

  constructor (params: { endpointName: string, response: Response }) {
    super()

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ResponseError)
    }

    this.response = params.response
    this.message = this.getMessage(params.endpointName, params.response)
  }
}

export default ResponseError
