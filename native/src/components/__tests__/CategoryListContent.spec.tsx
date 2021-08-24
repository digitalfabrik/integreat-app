import React from 'react'
import CategoryListContent from '../CategoryListContent'
import { render } from '@testing-library/react-native'
import moment, { Moment } from 'moment'
import buildConfig from '../../constants/buildConfig'
import 'react-native/Libraries/Utilities/useWindowDimensions'

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  default: jest.fn(() => ({ width: 1234 }))
}))
jest.mock('../TimeStamp', () => ({ lastUpdate }: { lastUpdate: Moment }) => {
  const Text = require('react-native').Text

  return <Text>lastUpdate {lastUpdate.toISOString()}</Text>
})

describe('CategoryListContent', () => {
  it('should display the last update timestamp correctly', () => {
    const content = 'This is some content'
    const iso = '2011-05-04T00:00:00.000Z'
    const lastUpdate = moment(iso)
    const { getByText } = render(
      <CategoryListContent
        content={content}
        navigateToLink={() => {}}
        cacheDictionary={{}}
        language='de'
        lastUpdate={lastUpdate}
        theme={buildConfig().lightTheme}
      />
    )
    expect(getByText(content)).toBeTruthy()
    expect(getByText(`lastUpdate ${iso}`)).toBeTruthy()
  })
})
