import createHistory from '../createHistory'
import { createMemoryHistory } from 'history'

describe('createHistory', () => {
  test('should create history to create a browser history by default', () => {
    expect(() => createHistory()).not.toThrow()
  })

  test('should create history which does not scroll to top when popping', () => {
    window.scrollTo = jest.fn()
    const internalHistory = createMemoryHistory()
    const history = createHistory(internalHistory)

    history.goBack()

    expect(window.scrollTo).not.toHaveBeenCalled()
    expect(internalHistory).toBe(history)
  })

  test('should create history which scrolls to top when not popping', () => {
    window.scrollTo = jest.fn()
    const internalHistory = createMemoryHistory()
    const history = createHistory(internalHistory)

    history.push('/')

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
    expect(internalHistory).toBe(history)
  })
})
