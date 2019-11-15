// @flow

import { FetchError, MappingError, ResponseError } from '@integreat-app/integreat-api-client'

type ErrorCodesType = {|
  PageDoesNotExist: 'page-does-not-exist',
  NetworkConnectionFailed: 'network-connection-failed',
  NetworkRequestFailed: 'network-request-failed', // server's http-status was not 200
  ResponseMappingFailed: 'response-mapping-failed',
  UnknownError: 'unknown-error'
|}

export const ErrorCodes: ErrorCodesType = {
  PageDoesNotExist: 'page-does-not-exist',
  NetworkConnectionFailed: 'network-connection-failed',
  NetworkRequestFailed: 'network-request-failed', // server's http-status was not 200
  ResponseMappingFailed: 'response-mapping-failed',
  UnknownError: 'unknown-error'
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
