import { FetchError, MappingError, ResponseError, NotFoundError } from 'api-client'

export enum ErrorCode {
  PageNotFound = 'pageNotFound',
  NetworkConnectionFailed = 'networkConnectionFailed',
  NetworkRequestFailed = 'networkRequestFailed',
  // server's http-status was not 200
  ResponseMappingFailed = 'responseMappingFailed',
  UnknownError = 'unknownError'
}

export const fromError = (error: Error): ErrorCode => {
  if (error instanceof ResponseError) {
    return ErrorCode.NetworkRequestFailed
  } else if (error instanceof MappingError) {
    return ErrorCode.ResponseMappingFailed
  } else if (error instanceof FetchError) {
    return ErrorCode.NetworkConnectionFailed
  } else if (error instanceof NotFoundError) {
    return ErrorCode.PageNotFound
  }

  return ErrorCode.UnknownError
}
