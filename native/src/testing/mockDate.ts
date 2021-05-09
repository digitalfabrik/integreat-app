// @flow

import type Moment from 'moment'
import moment from 'moment'

export default (mockDate: Moment): ({ restoreDate: () => void }) => {
  const spy = jest.spyOn(moment, 'now').mockReturnValue(mockDate)

  return {
    restoreDate: () => {
      spy.mockRestore()
    }
  }
}
