import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { TileModel } from 'shared'

import render from '../../testing/render'
import openExternalUrl from '../../utils/openExternalUrl'
import Tile from '../Tile'

jest.mock('../../utils/openExternalUrl', () => jest.fn(async () => undefined))

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
    expect(openExternalUrl).not.toHaveBeenCalled()
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

    expect(openExternalUrl).toHaveBeenCalledTimes(1)
    expect(openExternalUrl).toHaveBeenCalledWith(tile.path, expect.anything())
    expect(onTilePress).not.toHaveBeenCalled()
  })
})
