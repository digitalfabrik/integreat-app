import moment, { Moment } from 'moment'

export default (
  mockDate: Moment
): {
  restoreDate: () => void
} => {
  const spy = jest.spyOn(moment, 'now').mockReturnValue(mockDate.valueOf())
  return {
    restoreDate: () => {
      spy.mockRestore()
    }
  }
}
