// @flow

import { detect } from 'detect-browser'

class Platform {
  _browser: {| name: string, version: string |}

  constructor() {
    this._browser = detect()
  }

  /**
   * Supports these: https://developer.mozilla.org/de/docs/Web/CSS/CSS_Logical_Properties
   *
   * @returns {boolean}
   */
  get supportsLogicalProperties(): boolean {
    return this._browser && !this._browser.name.includes('ie') && !this._browser.name.includes('safari')
  }

  get positionStickyDisabled(): boolean {
    return !!(this._browser && this._browser.name === 'edge' && /^16\..*/.test(this._browser.version))
  }
}

export default Platform
