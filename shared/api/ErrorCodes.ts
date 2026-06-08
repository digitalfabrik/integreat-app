import FetchError from './errors/FetchError'
import MappingError from './errors/MappingError'
import NotFoundError from './errors/NotFoundError'
import ResponseError from './errors/ResponseError'

const FORBIDDEN_CODE = 403
const RATE_LIMIT_CODE = 429

export enum ErrorCode {
  RegionUnavailable = 'regionUnavailable',
  LanguageUnavailable = 'languageUnavailable',
  ForbiddenError = 'forbidden',
  PageNotFound = 'pageNotFound',
  NetworkConnectionFailed = 'networkConnectionFailed',
  NetworkRequestFailed = 'networkRequestFailed',
  RateLimited = 'rateLimited',
  ResponseMappingFailed = 'responseMappingFailed',
  UnknownError = 'unknownError',
}

export const fromError = (error: unknown): ErrorCode => {
  if (error instanceof ResponseError) {
    if (error.response.status === FORBIDDEN_CODE) {
      return ErrorCode.ForbiddenError
    }
    if (error.response.status === RATE_LIMIT_CODE) {
      return ErrorCode.RateLimited
    }
    return ErrorCode.NetworkRequestFailed
  }
  if (error instanceof MappingError) {
    return ErrorCode.ResponseMappingFailed
  }
  if (error instanceof FetchError) {
    return ErrorCode.NetworkConnectionFailed
  }
  if (error instanceof NotFoundError) {
    return ErrorCode.PageNotFound
  }

  return ErrorCode.UnknownError
}
