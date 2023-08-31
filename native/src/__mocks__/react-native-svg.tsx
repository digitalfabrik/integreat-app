/* eslint-disable import/no-import-module-exports */
import React, { ReactElement } from 'react'
import { Text } from 'react-native'

const realModule = jest.requireActual('react-native-svg')

const SvgUri = ({ uri }: { uri: string }): ReactElement => <Text>{uri}</Text>

module.exports = {
  ...realModule,
  SvgUri,
}
