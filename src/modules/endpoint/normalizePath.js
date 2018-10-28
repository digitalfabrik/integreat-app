// @flow

import { compose } from 'lodash/fp'
import normalizePath from 'normalize-path'

const normalize = compose([decodeURIComponent, normalizePath])

export default normalize
