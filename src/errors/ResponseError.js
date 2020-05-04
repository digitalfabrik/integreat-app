// @flow

type ResponseErrorParamsType = {|
  endpointName: string,
  response: Response,
  url: string,
  formData: ?FormData
|}

class ResponseError extends Error {
  _endpointName: string
  _response: Response
  _url: string
  _formData: ?FormData
  _message: string

  constructor (params: ResponseErrorParamsType) {
    super()

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ResponseError)
    }

    const { endpointName, response, url, formData } = params

    this._message = this.createMessage(params)
    this._endpointName = endpointName
    this._response = response
    this._url = url
    this._formData = formData
  }

  createMessage ({ formData, url, endpointName, response }: ResponseErrorParamsType): string {
    const stringifyFormData = (formData: ?FormData) => {
      if (formData) {
        const entries = {}
        for (const entry of formData.entries()) {
          entries[entry[0]] = entry[1]
        }

        return ` and the formData ${JSON.stringify(entries)}`
      }
      return ''
    }

    return `ResponseError:
     Failed to load the request for the ${endpointName} endpoint with the url ${url}${stringifyFormData(formData)}.
     Received response status ${response.status}.`
  }

  get message (): string {
    return this._message
  }

  set message (value: string) {
    this._message = value
  }

  get endpointName (): string {
    return this._endpointName
  }

  get response (): Response {
    return this._response
  }

  get url (): string {
    return this._url
  }

  get formData (): ?FormData {
    return this._formData
  }
}

export default ResponseError
