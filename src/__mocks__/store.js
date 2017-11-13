const store = jest.genMockFromModule('store')
const goBack = jest.fn()

store.history = {goBack}

module.exports = store
