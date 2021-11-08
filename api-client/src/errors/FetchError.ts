type FetchErrorParams = {
  endpointName: string
  innerError: Error
  url: string
  requestOptions: Partial<RequestInit>
}

class FetchError extends Error {
  _endpointName: string
  _url: string
  _requestOptions: Partial<RequestInit>
  _innerError: Error
  _message: string

  constructor(params: FetchErrorParams) {
    super()

    // captureStackTrace is not always defined on mobile
    // https://sentry.tuerantuer.org/organizations/digitalfabrik/issues/263/
    // https://sentry.tuerantuer.org/organizations/digitalfabrik/issues/265/
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FetchError)
    }

    this._message = this.createMessage(params)
    this._endpointName = params.endpointName
    this._url = params.url
    this._requestOptions = params.requestOptions
    this._message = this.createMessage(params)
    this._innerError = params.innerError
  }

  createMessage({ requestOptions, url, endpointName, innerError }: FetchErrorParams): string {
    let stringifiedFormData = ''

    if (requestOptions.method === 'POST' && typeof requestOptions.body === 'string') {
      stringifiedFormData = ` and the body ${requestOptions.body}`
    } else if (requestOptions.method === 'POST') {
      stringifiedFormData = ` and the formData ${JSON.stringify(requestOptions.body)}`
    }

    return `FetchError: Failed to ${requestOptions.method} the request for the ${endpointName} endpoint with the url
     ${url}${stringifiedFormData}. ${innerError.message}`
  }

  get message(): string {
    return this._message
  }

  get endpointName(): string {
    return this._endpointName
  }

  get innerError(): Error {
    return this._innerError
  }

  get url(): string {
    return this._url
  }

  get requestOptions(): Partial<RequestInit> {
    return this._requestOptions
  }
}

export default FetchError
