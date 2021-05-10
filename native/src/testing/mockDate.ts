import moment from 'moment'

export default (
  mockDate: number
): {
  restoreDate: () => void
} => {
  const spy = jest.spyOn(moment, 'now').mockReturnValue(mockDate)
  return {
    restoreDate: () => {
      spy.mockRestore()
    }
  }
}
