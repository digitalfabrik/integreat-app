import 'luxon'

declare module 'luxon' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  export interface TSSettings {
    throwOnInvalid: true
  }
}
