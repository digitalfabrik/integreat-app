import FetchError from './errors/FetchError.ts'
import MappingError from './errors/MappingError.ts'
import NotFoundError from './errors/NotFoundError.ts'
import ResponseError from './errors/ResponseError.ts'

const FORBIDDEN_CODE = 403
const RATE_LIMIT_CODE = 429

export const ErrorCodes = {
  RegionUnavailable: 'regionUnavailable',
  LanguageUnavailable: 'languageUnavailable',
  ForbiddenError: 'forbidden',
  PageNotFound: 'pageNotFound',
  NetworkConnectionFailed: 'networkConnectionFailed',
  NetworkRequestFailed: 'networkRequestFailed',
  RateLimited: 'rateLimited',
  ResponseMappingFailed: 'responseMappingFailed',
  UnknownError: 'unknownError',
}

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes]

export const fromError = (error: unknown): ErrorCode => {
  if (error instanceof ResponseError) {
    if (error.response.status === FORBIDDEN_CODE) {
      return ErrorCodes.ForbiddenError
    }
    if (error.response.status === RATE_LIMIT_CODE) {
      return ErrorCodes.RateLimited
    }
    return ErrorCodes.NetworkRequestFailed
  }
  if (error instanceof MappingError) {
    return ErrorCodes.ResponseMappingFailed
  }
  if (error instanceof FetchError) {
    return ErrorCodes.NetworkConnectionFailed
  }
  if (error instanceof NotFoundError) {
    return ErrorCodes.PageNotFound
  }

  return ErrorCodes.UnknownError
}
