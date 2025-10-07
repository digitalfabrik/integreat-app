import Button from '@mui/material/Button'
import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import useLocalStorage from '../useLocalStorage'

describe('useLocalStorage', () => {
  const key = 'my_storage_key'
  const MockComponent = () => {
    const { value, updateLocalStorageItem } = useLocalStorage({ key, initialValue: 0 })
    return (
      <div>
        {value}
        <Button onClick={() => updateLocalStorageItem(value + 1)}>Increment</Button>
      </div>
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('should correctly set initial value and update value', () => {
    const { getByText } = render(<MockComponent />)

    expect(getByText(0)).toBeTruthy()
    expect(localStorage.getItem(key)).toBe('0')

    fireEvent.click(getByText('Increment'))

    expect(getByText(1)).toBeTruthy()
    expect(localStorage.getItem(key)).toBe('1')

    fireEvent.click(getByText('Increment'))
    fireEvent.click(getByText('Increment'))
    fireEvent.click(getByText('Increment'))

    expect(getByText(4)).toBeTruthy()
    expect(localStorage.getItem(key)).toBe('4')
  })

  it('should not use initial value if already set', () => {
    localStorage.setItem(key, '10')
    const { getByText } = render(<MockComponent />)

    expect(getByText(10)).toBeTruthy()
    expect(localStorage.getItem(key)).toBe('10')

    fireEvent.click(getByText('Increment'))

    expect(getByText(11)).toBeTruthy()
    expect(localStorage.getItem(key)).toBe('11')
  })

  it('should continue to work even if local storage is not usable', () => {
    localStorage.getItem = () => {
      throw new Error('SecurityError')
    }
    localStorage.setItem = () => {
      throw new Error('SecurityError')
    }
    const { getByText } = render(<MockComponent />)

    expect(getByText(0)).toBeTruthy()
    expect(localStorage.getItem(key)).toBe('0')

    fireEvent.click(getByText('Increment'))

    expect(getByText(1)).toBeTruthy()
    expect(localStorage.getItem(key)).toBe('1')
  })
})
