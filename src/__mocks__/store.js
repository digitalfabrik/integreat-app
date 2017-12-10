import configureMockStore from 'redux-mock-store'
import { routerForBrowser } from 'redux-little-router'

const router = routerForBrowser({routes: {}})

const mockStore = configureMockStore([router.middleware])({router: router.reducer})

export default mockStore
