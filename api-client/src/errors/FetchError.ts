class FetchError extends Error {
  innerError: Error
  getMessage = (endpointName: string, innerError: Error): string =>
    `FetchError: Failed to load the request for the ${endpointName} endpoint. ${innerError.message}`

  constructor(params: { endpointName: string; innerError: Error }) {
    super()

    // captureStackTrace is not always defined on mobile
    // https://sentry.tuerantuer.org/organizations/digitalfabrik/issues/263/
    // https://sentry.tuerantuer.org/organizations/digitalfabrik/issues/265/
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FetchError)
    }

    this.message = this.getMessage(params.endpointName, params.innerError)
    this.innerError = params.innerError
  }
}

export default FetchError
