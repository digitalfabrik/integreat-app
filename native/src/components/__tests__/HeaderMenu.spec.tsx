import { fireEvent } from '@testing-library/react-native'
import React from 'react'
import { Button, Linking } from 'react-native'

import TestingAppContext from '../../testing/TestingAppContext'
import render from '../../testing/render'
import HeaderMenu from '../HeaderMenu'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: { message: string }) => (params ? `${key}: ${params.message}` : key),
  }),
}))
jest.mock('../../hooks/useSnackbar')

describe('HeaderMenu', () => {
  const renderMenuItem = (title: string, onPress: () => void) => <Button key={title} title={title} onPress={onPress} />

  it('calls disclaimer and licenses callbacks from the legal accordion', () => {
    const onNavigateToDisclaimer = jest.fn()
    const onNavigateToLicenses = jest.fn()
    const setVisible = jest.fn()

    const openURL = jest.fn()
    jest.spyOn(Linking, 'openURL').mockImplementation(openURL)

    const { getByText } = render(
      <TestingAppContext>
        <HeaderMenu
          visible
          setVisible={setVisible}
          menuItems={[]}
          renderMenuItem={renderMenuItem}
          onNavigateToDisclaimer={onNavigateToDisclaimer}
          onNavigateToLicenses={onNavigateToLicenses}
        />
      </TestingAppContext>,
    )

    fireEvent.press(getByText('legal'))

    fireEvent.press(getByText('disclaimer'))
    expect(onNavigateToDisclaimer).toHaveBeenCalledTimes(1)

    fireEvent.press(getByText('settings:openSourceLicenses'))
    expect(onNavigateToLicenses).toHaveBeenCalledTimes(1)

    fireEvent.press(getByText('settings:aboutUs'))
    expect(openURL).toHaveBeenCalled()
  })

  it('renders and calls feedback menu item callback', () => {
    const onFeedback = jest.fn()
    const onContrast = jest.fn()
    const setVisible = jest.fn()

    const { getByText } = render(
      <TestingAppContext>
        <HeaderMenu
          visible
          setVisible={setVisible}
          menuItems={[
            <Button key='feedback' title='feedback' onPress={onFeedback} />,
            <Button key='contrast' title='contrast' onPress={onContrast} />,
          ]}
          renderMenuItem={renderMenuItem}
          onNavigateToDisclaimer={jest.fn()}
        />
      </TestingAppContext>,
    )

    fireEvent.press(getByText('contrast'))
    expect(onContrast).toHaveBeenCalledTimes(1)
    fireEvent.press(getByText('feedback'))
    expect(onFeedback).toHaveBeenCalledTimes(1)
  })
})
