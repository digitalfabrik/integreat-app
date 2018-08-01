// @flow

import * as React from 'react'
import App from '../components/App'
import PlatformContext from '../../platform/PlatformContext'
import Platform from '../../platform/Platform'

export default () => <PlatformContext.Provider value={new Platform()}><App /></PlatformContext.Provider>
