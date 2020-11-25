// @flow

type FormDataNameValuePairType = [string, string]
type FormDataPartType = {
  string: string
} | {
  uri: string,
  name?: string,
  type?: string
}

// See https://github.com/RealOrangeOne/react-native-mock/blob/master/src/Libraries/Network/FormData.js for reference
class FormDataMock {
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

export default FormDataMock
