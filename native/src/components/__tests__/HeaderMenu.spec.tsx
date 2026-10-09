import { fireEvent } from '@testing-library/react-native'
import React from 'react'
import { Button } from 'react-native'

import TestingAppContext from '../../testing/TestingAppContext'
import createNavigationMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import useOpenExternalUrl from '../../utils/openExternalUrl'
import HeaderMenu from '../HeaderMenu'

jest.mock('../../hooks/useSnackbar')
jest.mock('../../utils/openExternalUrl')

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

  it('should open pdfs externally', () => {
    const openExternalUrl = jest.fn()
    jest.mocked(useOpenExternalUrl).mockImplementation(() => openExternalUrl)
    const shareUrl = 'https://example.com/file.pdf'

    const { getByText } = render(
      <TestingAppContext>
        <HeaderMenu navigation={navigation} visible setVisible={jest.fn()} menuItems={[]} shareUrl={shareUrl} />
      </TestingAppContext>,
    )

    fireEvent.press(getByText('common:actions.openExternal'))
    expect(openExternalUrl).toHaveBeenCalledWith(shareUrl)
  })

  it('should not show open externally for other urls', () => {
    const { queryByText } = render(
      <TestingAppContext>
        <HeaderMenu
          navigation={navigation}
          visible
          setVisible={jest.fn()}
          menuItems={[]}
          shareUrl='https://example.com/image.png'
        />
      </TestingAppContext>,
    )

    expect(queryByText('common:actions.openExternal')).toBeNull()
  })
})
