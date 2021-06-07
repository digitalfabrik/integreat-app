import Caption from '../Caption'
import { render } from '@testing-library/react-native'
import React from 'react'
import buildConfig from '../../constants/buildConfig'

describe('Caption', () => {
  it('should render and display a Caption', () => {
    const { getByText } = render(<Caption title='This is a test title!' theme={buildConfig().lightTheme} />)
    getByText('This is a test title!')
  })
})
