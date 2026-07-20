export const identifyByLabel = (label: string): ReturnType<typeof $> =>
  driver.isAndroid ? $(`~${label}`) : $(`//*[@label="${label}"]`)
