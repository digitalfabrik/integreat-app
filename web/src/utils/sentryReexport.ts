// This re-export allows webpack to treeshake away the functionality, we do not need from sentry.
export { init, addBreadcrumb, captureException } from '@sentry/react'
