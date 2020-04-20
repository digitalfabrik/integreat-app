// @flow

type ResponseErrorParamsType = {|
  endpointName: string,
  responseStatus: number,
  url: string,
  formData: ?FormData
|}

class ResponseError extends Error {
  _endpointName: string
  _responseStatus: number
  _url: string
  _formData: ?FormData
  _message: string

  constructor (params: ResponseErrorParamsType) {
    super()

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ResponseError)
    }

    const { endpointName, responseStatus, url, formData } = params

    this._message = this.createMessage(params)
    this._endpointName = endpointName
    this._responseStatus = responseStatus
    this._url = url
    this._formData = formData
  }

  createMessage ({ formData, url, endpointName, responseStatus }: ResponseErrorParamsType): string {
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
     Received response status ${responseStatus}.`
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

  get responseStatus (): number {
    return this._responseStatus
  }

  get url (): string {
    return this._url
  }

  get formData (): ?FormData {
    return this._formData
  }
}

export default ResponseError
