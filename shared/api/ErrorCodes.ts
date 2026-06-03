import FetchError from './errors/FetchError'
import MappingError from './errors/MappingError'
import NotFoundError from './errors/NotFoundError'
import ResponseError from './errors/ResponseError'

const FORBIDDEN_CODE = 403

export enum ErrorCode {
  RegionUnavailable = 'regionUnavailable',
  LanguageUnavailable = 'languageUnavailable',
  ForbiddenError = 'forbidden',
  PageNotFound = 'pageNotFound',
  NetworkConnectionFailed = 'networkConnectionFailed',
  NetworkRequestFailed = 'networkRequestFailed',
  ResponseMappingFailed = 'responseMappingFailed',
  UnknownError = 'unknownError',
}

export const fromError = (error: unknown): ErrorCode => {
  if (error instanceof ResponseError) {
    if (error.response.status === FORBIDDEN_CODE) {
      return ErrorCode.ForbiddenError
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
