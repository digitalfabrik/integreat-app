import { fireEvent, render } from '@testing-library/react-native'
import React, { ReactElement } from 'react'
import { Share, Text, View } from 'react-native'
import { mocked } from 'ts-jest/utils'

import { DASHBOARD_ROUTE, SHARE_SIGNAL_NAME } from 'api-client'

import useSnackbar from '../../hooks/useSnackbar'
import createNavigationMock from '../../testing/createNavigationPropMock'
import wrapWithTheme from '../../testing/wrapWithTheme'
import sendTrackingSignal from '../../utils/sendTrackingSignal'
import TransparentHeader from '../TransparentHeader'

jest.mock('../../hooks/useSnackbar')
jest.mock('../../utils/sendTrackingSignal')
jest.mock('react-navigation-header-buttons', () => ({
  HiddenItem: ({ title, accessibilityLabel }: { title: string; accessibilityLabel: string }) => (
    <Text accessibilityLabel={`hidden: ${accessibilityLabel}`}>hidden: {title}</Text>
  )
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
    t: (key: string) => key
  })
}))
jest.mock('@react-navigation/elements', () => ({
  HeaderBackButton: ({ onPress }: { onPress: () => void }) => <Text onPress={onPress}>HeaderBackButton</Text>
}))

describe('TransparentHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const buildProps = (shareUrl?: string): React.ComponentProps<typeof TransparentHeader> => ({
    navigation: createNavigationMock(),
    route: {
      key: 'key-0',
      name: DASHBOARD_ROUTE,
      params: {
        shareUrl
      }
    }
  })

  it('should show back button and navigate back on click', () => {
    const props = buildProps()
    const { getByText } = render(<TransparentHeader {...props} />, { wrapper: wrapWithTheme })
    fireEvent.press(getByText('HeaderBackButton'))
    expect(props.navigation.goBack).toHaveBeenCalledTimes(1)
  })

  it('should show snackbar if sharing fails', () => {
    const props = buildProps('https://example.com/share')
    const showSnackbar = jest.fn()
    mocked(useSnackbar).mockImplementation(() => showSnackbar)
    const share = jest.fn(() => {
      throw new Error('fail')
    })
    const spy = jest.spyOn(Share, 'share')
    spy.mockImplementation(share)

    const { getByLabelText } = render(<TransparentHeader {...props} />, { wrapper: wrapWithTheme })

    fireEvent.press(getByLabelText('hidden: share'))

    // expect(share).toHaveBeenCalledWith({ message: 'shareMessage', title: 'Integreat' })
    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: { name: SHARE_SIGNAL_NAME, url: 'https://example.com/share' }
    })

    expect(showSnackbar).toHaveBeenCalledWith('generalError')
  })
})
