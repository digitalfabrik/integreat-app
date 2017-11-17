import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({adapter: new Adapter()})

// Fail tests on any warning
console.error = message => {
  throw new Error(message)
}
