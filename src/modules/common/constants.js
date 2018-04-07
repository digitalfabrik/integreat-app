/* eslint-disable no-magic-numbers */
import { detect } from 'detect-browser'
const browser = detect()

export const positionStickyDisabled = browser && browser.name === 'edge' && /^16\..*/.test(browser.version)
