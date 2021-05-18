// stringifies FormData from react-native or the browser variant of it
export function stringifyFormData(formData: any): string {
  const entries: Record<string, any> = {}

  if (formData?.getParts) {
    for (const part of formData.getParts()) {
      entries[part.fieldName as string] = part.string
    }
  } else {
    for (const [key, value] of formData.entries()) {
      entries[key as string] = value
    }
  }

  return JSON.stringify(entries)
}
