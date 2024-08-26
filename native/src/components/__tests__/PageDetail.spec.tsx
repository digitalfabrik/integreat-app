import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { I18nManager } from 'react-native'

import render from '../../testing/render'
import PageDetail from '../PageDetail'

describe('PageDetail', () => {
  it('should display the given identifier followed by a colon', () => {
    const { queryAllByText, queryByText } = render(
      <NavigationContainer>
        <PageDetail identifier='Test Identifier' information='Some important information' language='de' />
      </NavigationContainer>,
    )
    expect(queryAllByText(/Test Identifier/)).toBeTruthy()
    expect(queryByText(/Some important information/)).toBeTruthy()
  })

  describe('should manually reverse if content language doesnt have the same direction as system language', () => {
    it('if system language is not rtl', () => {
      I18nManager.forceRTL(false)
      const { queryAllByText } = render(
        <NavigationContainer>
          <PageDetail identifier='Test Identifier' information='Some important information' language='de' />
        </NavigationContainer>,
      )
      queryAllByText(/Some important information/).forEach(element => {
        expect(element).toHaveStyle({
          flexDirection: 'row',
        })
      })
      const { queryAllByText: queryAllByTextReverse } = render(
        <NavigationContainer>
          <PageDetail identifier='Test Identifier' information='Some important information' language='ar' />
        </NavigationContainer>,
      )
      queryAllByTextReverse(/Some important information/).forEach(element => {
        expect(element).toHaveStyle({
          flexDirection: 'row-reverse',
        })
      })
    })

    it('if system language is rtl', () => {
      I18nManager.forceRTL(true)
      const { queryAllByText: queryAllByTextReverse } = render(
        <NavigationContainer>
          <PageDetail identifier='Test Identifier' information='Some important information' language='de' />
        </NavigationContainer>,
      )
      queryAllByTextReverse(/Some important information/).forEach(element => {
        expect(element).toHaveStyle({
          flexDirection: 'row-reverse',
        })
      })
      const { queryAllByText } = render(
        <NavigationContainer>
          <PageDetail identifier='Test Identifier' information='Some important information' language='ar' />
        </NavigationContainer>,
      )
      queryAllByText(/Some important information/).forEach(element => {
        expect(element).toHaveStyle({
          flexDirection: 'row',
        })
      })
    })
  })
})
