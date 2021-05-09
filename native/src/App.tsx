import React from 'react'
import { Text } from 'react-native'
import hello from 'build-configs'

export default () => {
  console.log(hello)
  return <Text>Hello World!{hello}</Text>
}
