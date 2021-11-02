class MappingError extends Error {
  getMessage = (endpointName: string, message: string): string =>
    `MappingError: Failed to map the json for the ${endpointName} endpoint. ${message}`

  constructor(endpointName: string, message: string) {
    super()

    // captureStackTrace is not always defined on mobile
    // https://sentry.tuerantuer.org/organizations/digitalfabrik/issues/263/
    // https://sentry.tuerantuer.org/organizations/digitalfabrik/issues/265/
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MappingError)
    }

    this.message = this.getMessage(endpointName, message)
  }
}

export default MappingError
