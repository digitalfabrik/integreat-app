import React from 'react'
import { detect } from 'detect-browser'

type BrowserType = {
  name: string
  version: string | null
}

export class Platform {
  _browser: BrowserType | null

  constructor() {
    this._browser = detect()
  }

  get positionStickyDisabled(): boolean {
    return !!(
      this._browser &&
      this._browser.version &&
      this._browser.name === 'edge' &&
      /^16\..*/.test(this._browser.version)
    )
  }
}

export default React.createContext<Platform>(new Platform())
