import { merge } from 'lodash'

export const defaultRequestOptions: Partial<RequestInit> = {}

export const request = (url: string, options: Partial<RequestInit>): Promise<Response> => {
  return fetch(url, merge(defaultRequestOptions, options))
}