import { merge } from 'lodash'

const defaultRequestOptions: Partial<RequestInit> = {}

export const setUserAgent = (userAgent: string): void => {
  defaultRequestOptions.headers = {
    ...defaultRequestOptions.headers,
    'User-Agent': userAgent
  }
}

export const request = (url: string, options: Partial<RequestInit>): Promise<Response> =>
  fetch(url, merge(defaultRequestOptions, options))
