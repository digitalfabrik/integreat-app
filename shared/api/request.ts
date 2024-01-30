import { merge } from 'lodash'

const defaultRequestOptions: Partial<RequestInit> = {}
let jpalTrackingCode: string | null = null

export const setJpalTrackingCode = (trackingCode: string | null): void => {
  jpalTrackingCode = trackingCode
}

export const getJpalTrackingCode = (): string | null => jpalTrackingCode

export const setUserAgent = (userAgent: string): void => {
  defaultRequestOptions.headers = {
    ...defaultRequestOptions.headers,
    'User-Agent': userAgent,
  }
}

export const request = (url: string, options: Partial<RequestInit>): Promise<Response> => {
  // merge mutates the first passed object which may lead to errors e.g. by setting body on a GET request
  const requestOptions = {}
  return fetch(url, merge(requestOptions, options, defaultRequestOptions))
}
