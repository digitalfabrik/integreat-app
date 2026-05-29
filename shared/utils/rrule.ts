// Workaround for CJS - ESM interop
// Fixes SyntaxError: The requested module 'rrule' does not provide an export named 'rrulestr'
import * as rrule from 'rrule'

export const { RRule, rrulestr } = rrule
