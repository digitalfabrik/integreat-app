// flow-typed signature: 6e2a74f1235fa9196abf4ed928db30bd
// flow-typed version: d566ab41b9/query-string_v6.x.x/flow_>=v0.32.x

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

  declare module.exports: {
    extract(str: string): string,
    parse(str: string, opts?: ParseOptions): Object,
    parseUrl(str: string, opts?: ParseOptions): { url: string, query: Object },
    stringify(obj: Object, opts?: StringifyOptions): string,
  }
}
