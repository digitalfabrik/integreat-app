import { fireEvent } from '@testing-library/react-native'
import React from 'react'
import { Button } from 'react-native'

import { CATEGORIES_ROUTE, DISCLAIMER_ROUTE, LICENSES_ROUTE } from 'shared'

import TestingAppContext from '../../testing/TestingAppContext'
import createNavigationMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import openExternalUrl from '../../utils/openExternalUrl'
import HeaderMenu from '../HeaderMenu'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: { message: string }) => (params ? `${key}: ${params.message}` : key),
  }),
}))
jest.mock('../../hooks/useSnackbar')
jest.mock('../../utils/openExternalUrl', () => jest.fn(async () => undefined))

describe('HeaderMenu', () => {
  const navigation = createNavigationMock()

  it('calls disclaimer and licenses callbacks from the legal accordion', () => {
    const setVisible = jest.fn()

    const { getByText } = render(
      <TestingAppContext>
        <HeaderMenu
          navigation={navigation}
          currentRoute={CATEGORIES_ROUTE}
          visible
          setVisible={setVisible}
          menuItems={[]}
        />
      </TestingAppContext>,
    )

    fireEvent.press(getByText('legal'))

    fireEvent.press(getByText('disclaimer'))
    expect(navigation.navigate).toHaveBeenCalledTimes(1)
    expect(navigation.navigate).toHaveBeenCalledWith(DISCLAIMER_ROUTE)

    fireEvent.press(getByText('settings:openSourceLicenses'))
    expect(navigation.navigate).toHaveBeenCalledTimes(2)
    expect(navigation.navigate).toHaveBeenCalledWith(LICENSES_ROUTE)

    fireEvent.press(getByText('settings:aboutUs'))
    expect(openExternalUrl).toHaveBeenCalled()
  })

  it('renders and calls feedback menu item callback', () => {
    const onFeedback = jest.fn()
    const onContrast = jest.fn()
    const setVisible = jest.fn()

    const { getByText } = render(
      <TestingAppContext>
        <HeaderMenu
          navigation={navigation}
          currentRoute={CATEGORIES_ROUTE}
          visible
          setVisible={setVisible}
          menuItems={[
            <Button key='feedback' title='feedback' onPress={onFeedback} />,
            <Button key='contrast' title='contrast' onPress={onContrast} />,
          ]}
        />
      </TestingAppContext>,
    )

    fireEvent.press(getByText('contrast'))
    expect(onContrast).toHaveBeenCalledTimes(1)
    fireEvent.press(getByText('feedback'))
    expect(onFeedback).toHaveBeenCalledTimes(1)
  })
})
