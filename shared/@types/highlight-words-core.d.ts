export type FindChunks = {
  autoEscape?: boolean | undefined
  caseSensitive?: boolean | undefined
  sanitize?: ((text: string) => string) | undefined
  searchWords: (string | RegExp)[]
  textToHighlight: string
}

export type FindAll = {
  autoEscape?: boolean | undefined
  caseSensitive?: boolean | undefined
  findChunks?: (args: FindChunks) => Chunk[]
  sanitize?: ((text: string) => string) | undefined
  searchWords: (string | RegExp)[]
  textToHighlight: string
}

export type Chunk = {
  start: number
  end: number
  highlight: boolean
}

export function findChunks(args: FindChunks): Chunk[]
export function findAll(args: FindAll): Chunk[]
