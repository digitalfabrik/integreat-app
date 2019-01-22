// @flow

import * as React from 'react'
import MemoryDatabase from '../MemoryDatabase'

const MemoryDatabaseContext: React.Context<MemoryDatabase> = React.createContext(new MemoryDatabase('')) // fixme: path

export default MemoryDatabaseContext
