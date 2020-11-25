// @flow

import { FetchError, MappingError, ResponseError } from 'api-client'

type ErrorCodesType = {|
  PageNotFound: 'pageNotFound',
  NetworkConnectionFailed: 'networkConnectionFailed',
  NetworkRequestFailed: 'networkRequestFailed', // server's http-status was not 200
  ResponseMappingFailed: 'responseMappingFailed',
  UnknownError: 'unknownError'
|}

const ErrorCodes: ErrorCodesType = {
  PageNotFound: 'pageNotFound',
  NetworkConnectionFailed: 'networkConnectionFailed',
  NetworkRequestFailed: 'networkRequestFailed', // server's http-status was not 200
  ResponseMappingFailed: 'responseMappingFailed',
  UnknownError: 'unknownError'
}

export type ErrorCodeType = $Values<ErrorCodesType>

export const fromError = (error: Error): ErrorCodeType => {
  if (error instanceof ResponseError) {
    return ErrorCodes.NetworkRequestFailed
  } else if (error instanceof MappingError) {
    return ErrorCodes.ResponseMappingFailed
  } else if (error instanceof FetchError) {
    return ErrorCodes.NetworkConnectionFailed
  }
  return ErrorCodes.UnknownError
}

export default ErrorCodes
