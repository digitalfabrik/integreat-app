// @flow

export function * iterateFormData (formData: FormData): Iterator<[string, string]> {
  if (formData.entries) {
    return formData.entries()
  }
  for (const part of formData.getParts()) {
    yield [part.fieldName, part.string]
  }
}