import { NavigationContainer } from '@react-navigation/native'
import { fireEvent, waitFor } from '@testing-library/react-native'
import React from 'react'
import { BackHandler, Button, Text, View } from 'react-native'

import render from '../../testing/render'
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
    jest.spyOn(BackHandler, 'addEventListener').mockImplementation((_, callback) => {
      backHandlerCallback = callback as () => boolean
      return { remove: jest.fn() }
    })
    backHandlerCallback = null
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should initialize history from params', async () => {
    const { getByText } = await render(<MockComponent params={{ value: 'initial', count: 5 }} />)

    expect(getByText('value: initial')).toBeTruthy()
    expect(getByText('count: 5')).toBeTruthy()
    expect(getByText('length: 1')).toBeTruthy()
  })

  it('should fall back to resetHistory when history is empty', async () => {
    const { getByText } = await render(<MockComponent params={{ value: 'initial', count: 1 }} />)

    await fireEvent.press(getByText('pop'))

    expect(getByText('length: 0')).toBeTruthy()
    expect(getByText('value: reset')).toBeTruthy()
    expect(getByText('count: 0')).toBeTruthy()
  })

  it('should push a new entry merged with the current state', async () => {
    const { getByText } = await render(<MockComponent params={{ value: 'initial', count: 3 }} />)

    await fireEvent.press(getByText('push'))

    expect(getByText('length: 2')).toBeTruthy()
    expect(getByText('value: pushed')).toBeTruthy()
    expect(getByText('count: 3')).toBeTruthy()
  })

  it('should pushReset using resetHistory as base instead of current state', async () => {
    const { getByText } = await render(<MockComponent params={{ value: 'initial', count: 5 }} />)

    await fireEvent.press(getByText('pushReset'))

    expect(getByText('length: 2')).toBeTruthy()
    expect(getByText('value: pushReset-value')).toBeTruthy()
    expect(getByText('count: 0')).toBeTruthy()
  })

  it('should pop the last history entry', async () => {
    const { getByText } = await render(<MockComponent params={{ value: 'initial', count: 1 }} />)

    await fireEvent.press(getByText('push'))
    expect(getByText('length: 2')).toBeTruthy()

    await fireEvent.press(getByText('pop'))

    expect(getByText('length: 1')).toBeTruthy()
    expect(getByText('value: initial')).toBeTruthy()
  })

  it('should reset history to [resetHistory]', async () => {
    const { getByText } = await render(<MockComponent params={{ value: 'initial', count: 1 }} />)

    await fireEvent.press(getByText('push'))
    await fireEvent.press(getByText('push'))
    expect(getByText('length: 3')).toBeTruthy()

    await fireEvent.press(getByText('reset'))

    expect(getByText('length: 1')).toBeTruthy()
    expect(getByText('value: reset')).toBeTruthy()
  })

  it('should reset history to a custom array', async () => {
    const { getByText } = await render(<MockComponent params={{ value: 'initial', count: 1 }} />)

    await fireEvent.press(getByText('resetCustom'))

    expect(getByText('length: 2')).toBeTruthy()
    // current is the last entry
    expect(getByText('value: custom2')).toBeTruthy()
    expect(getByText('count: 2')).toBeTruthy()
  })

  describe('system back button', () => {
    it('should pop and consume the event when history has more than one entry', async () => {
      const { getByText } = await render(<MockComponent params={{ value: 'initial', count: 1 }} />)

      await fireEvent.press(getByText('push'))
      expect(getByText('length: 2')).toBeTruthy()

      const result = backHandlerCallback?.()

      expect(result).toBe(true)
      await waitFor(() => expect(getByText('length: 1')).toBeTruthy())
      expect(getByText('value: initial')).toBeTruthy()
    })

    it('should re-register the back handler whenever history changes', async () => {
      const { getByText } = await render(<MockComponent params={{ value: 'initial', count: 1 }} />)

      const callsBefore = (BackHandler.addEventListener as jest.Mock).mock.calls.length

      await fireEvent.press(getByText('push'))

      expect((BackHandler.addEventListener as jest.Mock).mock.calls.length).toBeGreaterThan(callsBefore)
    })
  })

  it('should update history when params change', async () => {
    const { getByText, rerender } = await render(<MockComponent params={{ value: 'initial', count: 1 }} />)

    await rerender(
      <NavigationContainer>
        <MockComponent params={{ value: 'updated', count: 99 }} />
      </NavigationContainer>,
    )

    expect(getByText('value: updated')).toBeTruthy()
    expect(getByText('count: 99')).toBeTruthy()
    expect(getByText('length: 1')).toBeTruthy()
  })

  it('should keep the history if a new params object with unchanged values is passed', async () => {
    const { getByText, rerender } = await render(<MockComponent params={{ value: 'initial', count: 1 }} />)

    await fireEvent.press(getByText('push'))
    expect(getByText('length: 2')).toBeTruthy()

    await rerender(
      <NavigationContainer>
        <MockComponent params={{ value: 'initial', count: 1 }} />
      </NavigationContainer>,
    )

    expect(getByText('length: 2')).toBeTruthy()
    expect(getByText('value: pushed')).toBeTruthy()
  })

  it('should reset history to new params after entries were pushed', async () => {
    const { getByText, rerender } = await render(<MockComponent params={{ value: 'initial', count: 1 }} />)

    await fireEvent.press(getByText('push'))
    expect(getByText('length: 2')).toBeTruthy()

    await rerender(
      <NavigationContainer>
        <MockComponent params={{ value: 'new-params', count: 42 }} />
      </NavigationContainer>,
    )

    expect(getByText('length: 1')).toBeTruthy()
    expect(getByText('value: new-params')).toBeTruthy()
    expect(getByText('count: 42')).toBeTruthy()
  })
})
