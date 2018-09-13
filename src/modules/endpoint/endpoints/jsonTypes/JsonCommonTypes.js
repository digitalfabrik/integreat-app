// @flow

export type JsonPathType = {
  id: number,
  url: ?string,
  path: ?string
}

export type JsonAvailableLanguagesType = {
  [string]: JsonPathType
}

export type JsonLocationType = {
  id: number,
  name: string,
  address: string,
  town: string,
  state: ?string,
  postcode: ?string,
  region: ?string,
  country: string,
  latitude: ?string,
  longitude: ?string
}
