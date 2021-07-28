import { StackHeaderProps } from "@react-navigation/stack"
import { merge } from 'lodash/object'

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>
}


const mockStackHeaderProps = (props: DeepPartial<StackHeaderProps>): StackHeaderProps => {
  return merge(props, {
    layout: {
      width: 450,
      height: 600
    },
    insets: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    },
    styleInterpolator: jest.fn()
  })
}

export default mockStackHeaderProps