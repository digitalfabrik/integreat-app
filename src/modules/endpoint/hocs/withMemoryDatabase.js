// @flow

import * as React from 'react'
import MemoryDatabase from '../MemoryDatabase'
import MemoryDatabaseContext from '../context/MemoryDatabaseContext'

function withMemoryDatabase<Props: {}> (
  Component: React.ComponentType<Props>
): React.ComponentType<$Diff<Props, { database: MemoryDatabase | void }>> {
  class MemoryDatabase extends React.PureComponent<Props> {
    static contextType = MemoryDatabaseContext

    render () {
      return <Component {...this.props} database={this.context} />
    }
  }

  return MemoryDatabase
}

export default withMemoryDatabase
