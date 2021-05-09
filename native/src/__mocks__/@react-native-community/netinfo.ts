import type { NetInfoState, NetInfoSubscription } from '@react-native-community/netinfo'
import '@react-native-community/netinfo'
import { isString } from 'lodash'
export const fetch = jest.fn<[], Promise<NetInfoState>>(
  async (): Promise<NetInfoState> => {
    return {
      type: 'wifi',
      isConnected: true,
      isInternetReachable: true,
      details: {
        isConnectionExpensive: false
      }
    }
  }
)
export const addEventListener = (
  listener: (arg0: NetInfoState) => unknown,
  deprecatedHandler?: unknown
): NetInfoSubscription => {
  if (deprecatedHandler) {
    throw Error('Function is deprecated')
  }

  if (isString(listener)) {
    throw Error('Function is deprecated')
  }

  throw Error('Not yet implemented in mock.')
}
export const useNetInfo = (): NetInfoState => {
  throw Error('Not yet implemented in mock.')
}
export const removeEventListener = () => {
  throw Error('Function is deprecated')
}
export const getConnectionInfo = () => {
  throw Error('Function is deprecated')
}
export const isConnectionExpensive = () => {
  throw Error('Function is deprecated')
}
export const isConnected = {
  addEventListener: () => {
    throw Error('Function is deprecated')
  },
  removeEventListener: () => {
    throw Error('Function is deprecated')
  },
  fetch: () => {
    throw Error('Function is deprecated')
  }
}
export default {
  fetch,
  addEventListener,
  removeEventListener,
  useNetInfo,
  getConnectionInfo,
  isConnectionExpensive,
  isConnected
}
