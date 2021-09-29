import * as React from 'react'
import { ReactNode } from 'react'
import { Text } from 'react-native'
import StaticServer from 'react-native-static-server'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { SetResourceCacheUrlActionType, StoreActionType } from '../redux/StoreActionType'
import { RESOURCE_CACHE_DIR_PATH } from '../utils/DatabaseConnector'

type OwnPropsType = {
  children: React.ReactNode
}
type DispatchPropsType = {
  setResourceCacheUrl: (arg0: string) => void
}
type PropsType = OwnPropsType & DispatchPropsType

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>): DispatchPropsType => ({
  setResourceCacheUrl: (url: string) => {
    const setResourceCacheUrlAction: SetResourceCacheUrlActionType = {
      type: 'SET_RESOURCE_CACHE_URL',
      params: {
        url
      }
    }
    dispatch(setResourceCacheUrlAction)
  }
})

const SERVER_PATH = RESOURCE_CACHE_DIR_PATH
const SERVER_PORT = 8080

class StaticServerProvider extends React.Component<
  PropsType,
  {
    errorMessage: string | null
  }
> {
  staticServer = new StaticServer(SERVER_PORT, SERVER_PATH, {
    localOnly: true
  })

  state = {
    errorMessage: null
  }

  async componentDidMount() {
    try {
      const url = await this.staticServer.start()
      this.props.setResourceCacheUrl(url)
    } catch (e) {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({
        errorMessage: e.message
      })
    }
  }

  componentWillUnmount() {
    this.staticServer.stop()
  }

  render(): ReactNode {
    if (this.state.errorMessage !== null) {
      return <Text>{this.state.errorMessage}</Text>
    }

    return this.props.children
  }
}

export default connect(undefined, mapDispatchToProps)(StaticServerProvider)
