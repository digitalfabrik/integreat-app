// @flow

import { stringifyFormData } from '../stringifyFormData'

export type RequestOptionsType = { method: 'GET' } | { method: 'POST', body: FormData }

type ResponseErrorParamsType = {|
  endpointName: string,
  response: Response,
  url: string,
  requestOptions: RequestOptionsType
|}

class ResponseError extends Error {
  _endpointName: string
  _response: Response
  _url: string
  _requestOptions: RequestOptionsType
  _message: string

  constructor(params: ResponseErrorParamsType) {
    super()

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
    const stringifiedFormData =
      requestOptions.method === 'POST' ? ` and the formData ${stringifyFormData(requestOptions.body)}` : ''

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

  get requestOptions(): RequestOptionsType {
    return this._requestOptions
  }
}

export default ResponseError
