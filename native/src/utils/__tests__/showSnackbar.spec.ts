import showSnackbar from '../showSnackbar'

describe('showSnackbar', () => {
  const dispatch = jest.fn()

  it('should dispatch a snackbar', () => {
    const message = 'message'
    showSnackbar(dispatch, message)
    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(dispatch).toHaveBeenCalledWith({
      type: 'ENQUEUE_SNACKBAR',
      params: {
        text: message,
      },
    })
  })
})
