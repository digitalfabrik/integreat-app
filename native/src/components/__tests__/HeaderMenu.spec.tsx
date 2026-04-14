import { fireEvent } from '@testing-library/react-native'
import React from 'react'
import { Button } from 'react-native'

import { CATEGORIES_ROUTE } from 'shared'

import TestingAppContext from '../../testing/TestingAppContext'
import createNavigationMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
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
