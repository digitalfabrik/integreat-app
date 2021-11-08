type ResponseErrorParamsType = {
  endpointName: string
  response: Response
  url: string
  requestOptions: Partial<RequestInit>
}

class ResponseError extends Error {
  _endpointName: string
  _response: Response
  _url: string
  _requestOptions: Partial<RequestInit>
  _message: string

  constructor(params: ResponseErrorParamsType) {
    super()

    // captureStackTrace is not always defined on mobile
    // https://sentry.tuerantuer.org/organizations/digitalfabrik/issues/263/
    // https://sentry.tuerantuer.org/organizations/digitalfabrik/issues/265/
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ResponseError)
    }

    const { endpointName, response, url, requestOptions } = params
    this._message = this.createMessage(params)
    this._endpointName = endpointName
    this._response = response
    this._url = url
    this._requestOptions = requestOptions
  }

  createMessage({ requestOptions, url, endpointName, response }: ResponseErrorParamsType): string {
    let stringifiedFormData = ''

    if (requestOptions.method === 'POST' && typeof requestOptions.body === 'string') {
      stringifiedFormData = ` and the body ${requestOptions.body}`
    } else if (requestOptions.method === 'POST') {
      stringifiedFormData = ` and the formData ${JSON.stringify(requestOptions.body)}`
    }

    return `ResponseError: Failed to ${requestOptions.method} the request for the ${endpointName} endpoint with the url
     ${url}${stringifiedFormData}. Received response status ${response.status}: ${response.statusText}.`
  }

  get message(): string {
    return this._message
  }

  set message(value: string) {
    this._message = value
  }

  get endpointName(): string {
    return this._endpointName
  }

  get response(): Response {
    return this._response
  }

  get url(): string {
    return this._url
  }

  get requestOptions(): Partial<RequestInit> {
    return this._requestOptions
  }
}

export default ResponseError
