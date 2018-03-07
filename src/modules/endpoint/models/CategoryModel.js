// @flow

export type CategoryType = {
  id: number,
  url: string,
  title: string,
  parentId: number,
  parentUrl: ?string,
  content: string,
  thumbnail: string,
  order: number,
  availableLanguages: any
}
