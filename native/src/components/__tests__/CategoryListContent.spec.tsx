import { render } from '@testing-library/react-native'
import moment, { Moment } from 'moment'
import React from 'react'
import 'react-native/Libraries/Utilities/useWindowDimensions'

import CategoryListContent from '../CategoryListContent'

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  default: jest.fn(() => ({ width: 1234 })),
}))
jest.mock('../TimeStamp', () => ({ lastUpdate }: { lastUpdate: Moment }) => {
  const { Text } = require('react-native')

  return <Text>lastUpdate {lastUpdate.toISOString()}</Text>
})

jest.mock('../NativeHtml', () => ({ content }: { content: string }) => {
  const { Text } = require('react-native')
  return <Text>{content}</Text>
})

describe('CategoryListContent', () => {
  it('should display the last update timestamp correctly', () => {
    const content = 'This is some content'
    const iso = '2011-05-04T00:00:00.000Z'
    const lastUpdate = moment(iso)
    const { getByText } = render(
      <CategoryListContent content={content} cacheDictionary={{}} language='de' lastUpdate={lastUpdate} />
    )
    expect(getByText(content)).toBeTruthy()
    expect(getByText(`lastUpdate ${iso}`)).toBeTruthy()
  })
})
