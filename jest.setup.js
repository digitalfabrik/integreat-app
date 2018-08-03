import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

// React 16 Enzyme adapter
Enzyme.configure({adapter: new Adapter()})

const reason = 'The reason for this is that enzyme-adapter-react-16 does not support react-native.'

Enzyme.mount = () => {
  throw new Error(`Only use shallow! Enzyme does not support deep rendering! ${reason}`)
}
Enzyme.render = () => {
  throw new Error(`Only use shallow! Enzyme does not support mounting! ${reason}`)
}
