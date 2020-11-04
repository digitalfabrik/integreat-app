// @flow

type FormDataNameValuePairType = [string, string]
type HeadersType = { [name: string]: string }
type FormDataPartType = {
  string: string,
  headers: HeadersType
} | {
  uri: string,
  headers: HeadersType,
  name?: string,
  type?: string
}

// See https://github.com/RealOrangeOne/react-native-mock/blob/master/src/Libraries/Network/FormData.js for reverence
class FormData {
  _parts: Array<FormDataNameValuePairType>

  constructor () {
    this._parts = []
  }

  append (key: string, value: string) {
    this._parts.push([key, value])
  }

  getParts (): Array<FormDataPartType> {
    return this._parts.map(([name, value]) => {
      return {
        string: value,
        fieldName: name
      }
    })
  }
}

module.exports = FormData
