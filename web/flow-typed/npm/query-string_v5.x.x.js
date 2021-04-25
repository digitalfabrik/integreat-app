// flow-typed signature: 999f73435cff55e7b960467439336719
// flow-typed version: c6154227d1/query-string_v5.x.x/flow_>=v0.104.x

declare module "query-string" {
  declare type ArrayFormat = "none" | "bracket" | "index";
  declare type ParseOptions = {|
    arrayFormat?: ArrayFormat
  |};

  declare type StringifyOptions = {|
    arrayFormat?: ArrayFormat,
    encode?: boolean,
    strict?: boolean
  |};

  declare module.exports: {
    extract(str: string): string,
    parse(str: string, opts?: ParseOptions): Object,
    stringify(obj: Object, opts?: StringifyOptions): string,
    ...
  };
}
