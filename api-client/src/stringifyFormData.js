// @flow

type FormDataType = FormData
  | { getParts: () => Array<{ string: string, fieldName: string }> }

export function stringifyFormData (formData: FormDataType): string {
  const entries = {}
  if (formData.entries) {
    for (const [key, value] of formData.entries()) {
      entries[key] = value
    }
  } else {
    for (const part of formData.getParts()) {
      entries[part.fieldName] = part.string
    }
  }
  return JSON.stringify(entries)
}
