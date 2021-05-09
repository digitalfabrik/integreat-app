// @flow

// stringifies FormData from react-native or the browser variant of it
export function stringifyFormData(formData: any): string {
  const entries = {}
  if (formData?.getParts) {
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
