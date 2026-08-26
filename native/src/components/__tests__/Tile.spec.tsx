import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { TileModel } from 'shared'

import render from '../../testing/render'
import Tile from '../Tile'

const mockOpenExternalUrl = jest.fn()
jest.mock('../../utils/openExternalUrl', () => ({ __esModule: true, default: () => mockOpenExternalUrl }))

describe('Tile', () => {
  const onTilePress = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call onTilePress', () => {
    const tile = new TileModel({
      title: 'my category tile',
      path: '/example/category/path',
      thumbnail: null,
      isExternalUrl: false,
    })
    const { getByText } = render(<Tile tile={tile} onTilePress={onTilePress} language='' />)
    fireEvent.press(getByText(tile.title))

    expect(onTilePress).toHaveBeenCalledTimes(1)
    expect(onTilePress).toHaveBeenCalledWith(tile)
    expect(mockOpenExternalUrl).not.toHaveBeenCalled()
  })

  it('should open external url', () => {
    const tile = new TileModel({
      title: 'my category tile',
      path: 'https://example.com/test',
      thumbnail: null,
      isExternalUrl: true,
    })
    const { getByText } = render(<Tile tile={tile} onTilePress={onTilePress} language='' />)
    fireEvent.press(getByText(tile.title))

    expect(mockOpenExternalUrl).toHaveBeenCalledTimes(1)
    expect(mockOpenExternalUrl).toHaveBeenCalledWith(tile.path)
    expect(onTilePress).not.toHaveBeenCalled()
  })
})
