// @flow

import React from 'react'
import HeaderActionItemDropDown from '../HeaderActionItemDropDown'
import { fireEvent, render, cleanup } from '@testing-library/react'
import theme from '../../../theme/constants/theme'
import { ThemeProvider } from 'styled-components'

describe('HeaderActionItemDropDown', () => {
  let wrapperComponent
  let inner
  let outside

  beforeEach(() => {
    const InnerComponent = (props: {| closeDropDown: () => void |}) => {
      return <span onClick={props.closeDropDown}>Do you see me?</span>
    }

    wrapperComponent = render(
      <ThemeProvider theme={theme}>
        <span>Click me to trigger dropdown!</span>
        <HeaderActionItemDropDown iconSrc='/someImg' text='some text' direction={'ltr'}>
          {closeDropDown => <InnerComponent closeDropDown={closeDropDown} />}
        </HeaderActionItemDropDown>
      </ThemeProvider>
    )

    inner = wrapperComponent.getByText('Do you see me?')
    outside = wrapperComponent.getByText('Click me to trigger dropdown!')
  })

  afterEach(() => {
    cleanup()
  })

  it('should open and close dropdown', () => {
    expect(inner).not.toBeVisible()

    const button = wrapperComponent.getByRole('button')
    fireEvent.click(button)

    expect(inner).toBeVisible()

    fireEvent.click(button)
    expect(wrapperComponent.queryByText('Do you see me?')).not.toBeVisible()
  })

  it('should close if clicked outside', async () => {
    const button = wrapperComponent.getByRole('button')
    fireEvent.click(button)
    expect(inner).toBeVisible()

    fireEvent.mouseDown(outside)

    expect(wrapperComponent.queryByText('Do you see me?')).not.toBeVisible()

    fireEvent.click(button)
    expect(inner).toBeVisible()
  })

  it('should close if inner component demands', async () => {
    fireEvent.click(wrapperComponent.getByRole('button'))
    expect(inner).toBeVisible()
    fireEvent.click(inner)
    expect(inner).not.toBeVisible()
  })

  it('should close if pressing escape', async () => {
    fireEvent.click(wrapperComponent.getByRole('button'))
    expect(inner).toBeVisible()
    fireEvent.keyDown(outside, { keyCode: 27 })
    expect(inner).not.toBeVisible()
  })

  it('should close if pressing enter', async () => {
    fireEvent.click(wrapperComponent.getByRole('button'))
    expect(inner).toBeVisible()
    fireEvent.keyDown(outside, { keyCode: 13 })
    expect(inner).not.toBeVisible()
  })

  it('should be closed from the beginning', () => {
    expect(inner).not.toBeVisible()
  })
})
