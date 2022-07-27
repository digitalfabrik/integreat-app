import { NetInfoState, NetInfoSubscription } from '@react-native-community/netinfo'
import { isString } from 'lodash'

export const fetch = jest.fn<Promise<NetInfoState>, []>(
  async (): Promise<NetInfoState> =>
    ({
      type: 'wifi',
      isConnected: true,
      isInternetReachable: true,
      details: {
        isConnectionExpensive: false,
      },
    } as NetInfoState)
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
export const removeEventListener = (): void => {
  throw Error('Function is deprecated')
}
export const getConnectionInfo = (): void => {
  throw Error('Function is deprecated')
}
export const isConnectionExpensive = (): void => {
  throw Error('Function is deprecated')
}
export const isConnected = {
  addEventListener: (): void => {
    throw Error('Function is deprecated')
  },
  removeEventListener: (): void => {
    throw Error('Function is deprecated')
  },
  fetch: (): void => {
    throw Error('Function is deprecated')
  },
}
export default {
  fetch,
  addEventListener,
  removeEventListener,
  useNetInfo,
  getConnectionInfo,
  isConnectionExpensive,
  isConnected,
}
