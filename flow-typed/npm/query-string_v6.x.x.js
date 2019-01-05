// flow-typed signature: 65b9bc513d2243711e6866cf22037ea8
// flow-typed version: 0671bf6d89/query-string_v6.x.x/flow_>=v0.32.x

declare module 'query-string' {
  declare type ArrayFormat = 'none' | 'bracket' | 'index'
  declare type ParseOptions = {|
    arrayFormat?: ArrayFormat,
  |}

  declare type StringifyOptions = {|
    arrayFormat?: ArrayFormat,
    encode?: boolean,
    strict?: boolean,
    sort?: false | <A, B>(A, B) => number,
  |}

  declare type QueryParameters = {
    [string]: string | Array<string> | null
  }

  declare module.exports: {
    extract(str: string): string,
    parse(str: string, opts?: ParseOptions): QueryParameters,
    parseUrl(str: string, opts?: ParseOptions): { url: string, query: QueryParameters },
    stringify(obj: QueryParameters, opts?: StringifyOptions): string,
  }
}
