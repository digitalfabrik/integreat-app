// @flow

import { render } from 'react-native-testing-library'
import React from 'react'
import PageDetail, { Identifier } from '../PageDetail'

describe('PageDetail', () => {
  it('should display the given identifier followed by a colon', () => {
    const { getByType } = render(
      <PageDetail identifier={'Test Identifier'} information={'Some important information'} />
    )
    const identifier = getByType(Identifier).props.children.join('')
    expect(identifier).toEqual('Test Identifier:')
  })
})
