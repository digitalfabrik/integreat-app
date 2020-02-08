// flow-typed signature: 2b3d4954df626f8d9efdf79cb34ffb9f
// flow-typed version: 6feb760931/url-parse_v1.3.x/flow_>=v0.104.x

declare module 'url-parse' {
  declare export type Url = {
    protocol: string,
    slashes: boolean,
    auth: string,
    username: string,
    password: string,
    host: string,
    hostname: string,
    port: string,
    pathname: string,
    query: { [key: string]: string },
    hash: string,
    href: string,
    origin: string,
    set: (part: string, value: mixed, fn?: (boolean | (value: mixed) => Object)) => Url,
    toString: () => string,
    lolcation: (loc?: (Object | string)) => Object,
    ...
  };

  // In the library, if location is not (Object | string), it is assigned to parser. Therefore,
  // to make less confusing for the user, we type both signatures
  declare type UrlConstructor =
    & ((adress: string, location: (Object | string), parser?: (boolean | string => Object)) => Url)
    & ((adress: string, parser?: (boolean | string => Object)) => Url);

  declare export default UrlConstructor;
}
