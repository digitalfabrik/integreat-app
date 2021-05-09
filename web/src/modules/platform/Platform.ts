import { detect } from "detect-browser";

class Platform {
  _browser: {
    name: string;
    version: string;
  };

  constructor() {
    this._browser = detect();
  }

  get positionStickyDisabled(): boolean {
    return !!(this._browser && this._browser.name === 'edge' && /^16\..*/.test(this._browser.version));
  }

}

export default Platform;