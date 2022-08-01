import { fireEvent } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React, { ReactElement } from 'react'
import { Share, Text, View } from 'react-native'

import { DASHBOARD_ROUTE, SHARE_SIGNAL_NAME } from 'api-client'

import useSnackbar from '../../hooks/useSnackbar'
import createNavigationMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import wrapWithTheme from '../../testing/wrapWithTheme'
import sendTrackingSignal from '../../utils/sendTrackingSignal'
import TransparentHeader from '../TransparentHeader'

jest.mock('../../hooks/useSnackbar')
jest.mock('../../utils/sendTrackingSignal')
jest.mock('react-navigation-header-buttons', () => ({
  HiddenItem: ({ title, accessibilityLabel }: { title: string; accessibilityLabel: string }) => (
    <Text accessibilityLabel={`hidden: ${accessibilityLabel}`}>hidden: {title}</Text>
  ),
}))
jest.mock(
  '../MaterialHeaderButtons',
  () =>
    ({ items, overflowItems }: { items: ReactElement; overflowItems: ReactElement }) =>
      (
        <View>
          {items}
          {overflowItems}
        </View>
      )
)
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))
jest.mock('@react-navigation/elements', () => ({
  HeaderBackButton: ({ onPress }: { onPress: () => void }) => <Text onPress={onPress}>HeaderBackButton</Text>,
}))

describe('TransparentHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const buildProps = (routeIndex: number, shareUrl?: string): React.ComponentProps<typeof TransparentHeader> => ({
    navigation: createNavigationMock(routeIndex),
    route: {
      key: 'key-0',
      name: DASHBOARD_ROUTE,
      params: {
        shareUrl,
      },
    },
  })

  it('should show back button and navigate back on click if stack exists', () => {
    const props = buildProps(1)
    const { getByText } = render(<TransparentHeader {...props} />)
    fireEvent.press(getByText('HeaderBackButton'))
    expect(props.navigation.goBack).toHaveBeenCalledTimes(1)
  })

  it('should hide header if there is no navigation stack', () => {
    const props = buildProps(0)
    const { queryByTestId } = render(<TransparentHeader {...props} />, { wrapper: wrapWithTheme })
    expect(queryByTestId('transparent-header')).toBeNull()
  })

  it('should show snackbar if sharing fails', () => {
    const props = buildProps(1, 'https://example.com/share')
    const showSnackbar = jest.fn()
    mocked(useSnackbar).mockImplementation(() => showSnackbar)
    const share = jest.fn(() => {
      throw new Error('fail')
    })
    const spy = jest.spyOn(Share, 'share')
    spy.mockImplementation(share)

    const { getByLabelText } = render(<TransparentHeader {...props} />)

    fireEvent.press(getByLabelText('hidden: share'))

    // expect(share).toHaveBeenCalledWith({ message: 'shareMessage', title: 'Integreat' })
    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: { name: SHARE_SIGNAL_NAME, url: 'https://example.com/share' },
    })

    expect(showSnackbar).toHaveBeenCalledWith('generalError')
  })
})
