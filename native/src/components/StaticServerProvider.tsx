import StaticServer from '@dr.pogodin/react-native-static-server'
import * as React from 'react'
import { ReactNode } from 'react'
import { Text } from 'react-native'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { SetResourceCacheUrlActionType, StoreActionType } from '../redux/StoreActionType'
import { RESOURCE_CACHE_DIR_PATH } from '../utils/DatabaseConnector'
import { getErrorMessage } from '../utils/helpers'

type OwnPropsType = {
  children: React.ReactNode
}
type DispatchPropsType = {
  setResourceCacheUrl: (arg0: string) => void
}
type StaticServerProviderPropsType = OwnPropsType & DispatchPropsType

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>): DispatchPropsType => ({
  setResourceCacheUrl: (url: string) => {
    const setResourceCacheUrlAction: SetResourceCacheUrlActionType = {
      type: 'SET_RESOURCE_CACHE_URL',
      params: {
        url,
      },
    }
    dispatch(setResourceCacheUrlAction)
  },
})

const SERVER_PATH = RESOURCE_CACHE_DIR_PATH
const SERVER_PORT = 8080

class StaticServerProvider extends React.Component<
  StaticServerProviderPropsType,
  {
    errorMessage: string | null
  }
> {
  staticServer = new StaticServer(SERVER_PORT, SERVER_PATH, {
    localOnly: true,
  })

  state = {
    errorMessage: null,
  }

  async componentDidMount() {
    const { setResourceCacheUrl } = this.props
    try {
      const url = await this.staticServer.start()
      setResourceCacheUrl(url)
    } catch (e) {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({
        errorMessage: getErrorMessage(e),
      })
    }
  }

  componentWillUnmount() {
    this.staticServer.stop()
  }

  render(): ReactNode {
    const { errorMessage } = this.state
    const { children } = this.props

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (errorMessage !== null) {
      return <Text>{errorMessage}</Text>
    }

    return children
  }
}

export default connect(undefined, mapDispatchToProps)(StaticServerProvider)
