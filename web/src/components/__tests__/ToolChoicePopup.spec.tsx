import { fireEvent } from '@testing-library/react'
import React from 'react'

import { BESCHEID_CHECK_ROUTE, getChatName } from 'shared'

import buildConfig from '../../constants/buildConfig'
import { renderRoute } from '../../testing/render'
import ToolChoicePopup from '../ToolChoicePopup'

const chatName = getChatName(buildConfig().appName)

const renderToolChoicePopup = (close: () => void = jest.fn()) =>
  renderRoute(<ToolChoicePopup anchorEl={document.body} close={close} />, { pathname: '/', routePattern: '/' })

describe('ToolChoicePopup', () => {
  it('should open chat and close the dialog when selecting chat', () => {
    const close = jest.fn()
    const { getByRole, router } = renderToolChoicePopup(close)

    fireEvent.click(getByRole('button', { name: new RegExp(chatName) }))

    expect(router.state.location.search).toBe('?chat=true')
    expect(close).toHaveBeenCalled()
  })

  it('should link the Bescheid-Check entry to the Bescheid-Check route', () => {
    const { getByRole } = renderToolChoicePopup()

    expect(getByRole('link', { name: /common:actions.openName Bescheid-Check/ })).toHaveAttribute(
      'href',
      `/${BESCHEID_CHECK_ROUTE}`,
    )
  })
})
