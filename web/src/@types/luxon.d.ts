import 'luxon'

declare module 'luxon' {
  export interface TSSettings {
    throwOnInvalid: true
  }
}
