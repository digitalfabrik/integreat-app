import React from 'react'
import { render } from '@testing-library/react-native'
import MaterialHeaderButtons from '../MaterialHeaderButtons'
import buildConfig from '../../constants/buildConfig'
import { Item } from 'react-navigation-header-buttons'

describe('Material Header Buttons', () => {
  const goToTest = jest.fn()
  it('should set opacity to material header buttons to zero while loading', () => {
    const { getByTestId } = render(
      <MaterialHeaderButtons cancelLabel={'cancel'} theme={buildConfig().lightTheme}>
        <Item
          testID='item'
          title={'search'}
          accessibilityLabel={'always'}
          iconName={'search'}
          show={'always'}
          onPress={goToTest}
          style={{ opacity: 0 }}
        />
      </MaterialHeaderButtons>
    )
    expect(getByTestId('item')).toHaveStyle({ opacity: 0 })
  })
  it('should set opacity to material header buttons to one after loading was finished', () => {
    const { getByTestId } = render(
      <MaterialHeaderButtons cancelLabel={'cancel'} theme={buildConfig().lightTheme}>
        <Item
          testID='item'
          title={'search'}
          accessibilityLabel={'always'}
          iconName={'search'}
          show={'always'}
          onPress={goToTest}
          style={{ opacity: 1 }}
        />
      </MaterialHeaderButtons>
    )
    expect(getByTestId('item')).toHaveStyle({ opacity: 1 })
  })
})
