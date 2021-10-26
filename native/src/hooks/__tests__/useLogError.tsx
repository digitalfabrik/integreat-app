import { render } from '@testing-library/react-native'
import React from 'react'

import { MappingError } from 'api-client'

import { logError } from '../../utils/helpers'
import useLogError from '../useLogError'

jest.mock('../../utils/helpers')

describe('useLogError', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const MockComponent = ({ error }: { error: Error | null }) => {
    useLogError(error)
    return null
  }

  it('should report error', async () => {
    const { rerender } = render(<MockComponent error={null} />)
    expect(logError).not.toHaveBeenCalled()

    const error = new MappingError('cities', 'some error')
    rerender(<MockComponent error={error} />)

    expect(logError).toHaveBeenCalledTimes(1)
    expect(logError).toHaveBeenCalledWith(error)

    rerender(<MockComponent error={null} />)
    expect(logError).toHaveBeenCalledTimes(1)
  })
})
