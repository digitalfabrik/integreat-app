import { fireEvent, render, waitFor } from '@testing-library/react-native'
import React from 'react'
import { BackHandler, Button, Text, View } from 'react-native'

import useLocalStackHistory from '../useLocalStackHistory'

type TestState = { value: string; count: number }

const resetState: TestState = { value: 'reset', count: 0 }

const MockComponent = ({ params }: { params: { value: string; count: number } }) => {
  const { current, history, push, pushReset, pop, reset } = useLocalStackHistory({
    params,
    historyFromParams: params => [{ value: params.value, count: params.count }],
    resetHistory: resetState,
  })

  return (
    <View>
      <Text>value: {current.value}</Text>
      <Text>count: {current.count}</Text>
      <Text>length: {history.length}</Text>
      <Button title='push' onPress={() => push({ value: 'pushed' })} />
      <Button title='pushReset' onPress={() => pushReset({ value: 'pushReset-value' })} />
      <Button title='pop' onPress={pop} />
      <Button title='reset' onPress={() => reset()} />
      <Button
        title='resetCustom'
        onPress={() =>
          reset([
            { value: 'custom1', count: 1 },
            { value: 'custom2', count: 2 },
          ])
        }
      />
    </View>
  )
}

describe('useLocalStackHistory', () => {
  let backHandlerCallback: (() => boolean) | null = null

  beforeEach(() => {
    jest.spyOn(BackHandler, 'addEventListener').mockImplementation((event, callback) => {
      backHandlerCallback = callback as () => boolean
      return { remove: jest.fn() }
    })
    backHandlerCallback = null
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should initialize history from params', () => {
    const { getByText } = render(<MockComponent params={{ value: 'initial', count: 5 }} />)

    expect(getByText('value: initial')).toBeTruthy()
    expect(getByText('count: 5')).toBeTruthy()
    expect(getByText('length: 1')).toBeTruthy()
  })

  it('should fall back to resetHistory when history is empty', () => {
    const { getByText } = render(<MockComponent params={{ value: 'initial', count: 1 }} />)

    fireEvent.press(getByText('pop'))

    expect(getByText('length: 0')).toBeTruthy()
    expect(getByText('value: reset')).toBeTruthy()
    expect(getByText('count: 0')).toBeTruthy()
  })

  it('should push a new entry merged with the current state', () => {
    const { getByText } = render(<MockComponent params={{ value: 'initial', count: 3 }} />)

    fireEvent.press(getByText('push'))

    expect(getByText('length: 2')).toBeTruthy()
    expect(getByText('value: pushed')).toBeTruthy()
    expect(getByText('count: 3')).toBeTruthy()
  })

  it('should pushReset using resetHistory as base instead of current state', () => {
    const { getByText } = render(<MockComponent params={{ value: 'initial', count: 5 }} />)

    fireEvent.press(getByText('pushReset'))

    expect(getByText('length: 2')).toBeTruthy()
    expect(getByText('value: pushReset-value')).toBeTruthy()
    expect(getByText('count: 0')).toBeTruthy()
  })

  it('should pop the last history entry', () => {
    const { getByText } = render(<MockComponent params={{ value: 'initial', count: 1 }} />)

    fireEvent.press(getByText('push'))
    expect(getByText('length: 2')).toBeTruthy()

    fireEvent.press(getByText('pop'))

    expect(getByText('length: 1')).toBeTruthy()
    expect(getByText('value: initial')).toBeTruthy()
  })

  it('should reset history to [resetHistory]', () => {
    const { getByText } = render(<MockComponent params={{ value: 'initial', count: 1 }} />)

    fireEvent.press(getByText('push'))
    fireEvent.press(getByText('push'))
    expect(getByText('length: 3')).toBeTruthy()

    fireEvent.press(getByText('reset'))

    expect(getByText('length: 1')).toBeTruthy()
    expect(getByText('value: reset')).toBeTruthy()
  })

  it('should reset history to a custom array', () => {
    const { getByText } = render(<MockComponent params={{ value: 'initial', count: 1 }} />)

    fireEvent.press(getByText('resetCustom'))

    expect(getByText('length: 2')).toBeTruthy()
    // current is the last entry
    expect(getByText('value: custom2')).toBeTruthy()
    expect(getByText('count: 2')).toBeTruthy()
  })

  describe('system back button', () => {
    it('should pop and consume the event when history has more than one entry', async () => {
      const { getByText } = render(<MockComponent params={{ value: 'initial', count: 1 }} />)

      fireEvent.press(getByText('push'))
      expect(getByText('length: 2')).toBeTruthy()

      const result = backHandlerCallback?.()

      expect(result).toBe(true)
      await waitFor(() => expect(getByText('length: 1')).toBeTruthy())
      expect(getByText('value: initial')).toBeTruthy()
    })

    it('should reset and allow back navigation when history has one entry', async () => {
      const { getByText } = render(<MockComponent params={{ value: 'initial', count: 1 }} />)

      expect(getByText('length: 1')).toBeTruthy()

      const result = backHandlerCallback?.()

      expect(result).toBe(false)
      await waitFor(() => expect(getByText('length: 1')).toBeTruthy())
      expect(getByText('value: reset')).toBeTruthy()
    })

    it('should re-register the back handler whenever history changes', () => {
      const { getByText } = render(<MockComponent params={{ value: 'initial', count: 1 }} />)

      const callsBefore = (BackHandler.addEventListener as jest.Mock).mock.calls.length

      fireEvent.press(getByText('push'))

      expect((BackHandler.addEventListener as jest.Mock).mock.calls.length).toBeGreaterThan(callsBefore)
    })
  })

  it('should update history when params change', () => {
    const { getByText, rerender } = render(<MockComponent params={{ value: 'initial', count: 1 }} />)

    rerender(<MockComponent params={{ value: 'updated', count: 99 }} />)

    expect(getByText('value: updated')).toBeTruthy()
    expect(getByText('count: 99')).toBeTruthy()
    expect(getByText('length: 1')).toBeTruthy()
  })

  it('should reset history to new params after entries were pushed', () => {
    const { getByText, rerender } = render(<MockComponent params={{ value: 'initial', count: 1 }} />)

    fireEvent.press(getByText('push'))
    expect(getByText('length: 2')).toBeTruthy()

    rerender(<MockComponent params={{ value: 'new-params', count: 42 }} />)

    expect(getByText('length: 1')).toBeTruthy()
    expect(getByText('value: new-params')).toBeTruthy()
    expect(getByText('count: 42')).toBeTruthy()
  })
})
