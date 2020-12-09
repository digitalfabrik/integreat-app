// @flow

type FormDataType = FormData | {| getParts: () => Array<{| string: string, fieldName: string |}> |}

// stringifies FormData from react-native or the browser variant of it
export function stringifyFormData (formData: FormDataType): string {
  const entries = {}
  if (formData.getParts) {
    for (const part of formData.getParts()) {
      entries[part.fieldName] = part.string
    }
  } else {
    for (const [key, value] of formData.entries()) {
      entries[key] = value
    }
  }
  return JSON.stringify(entries)
}
