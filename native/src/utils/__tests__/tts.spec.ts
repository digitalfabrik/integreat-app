import { Platform } from 'react-native'

import { prepareText } from '../tts'

describe('tts', () => {
  it('should correctly strip Uhr from tts sentences on android', () => {
    Platform.OS = 'android'
    expect(prepareText('Dies ist mein Text, geschrieben um 12Uhr und später')).toEqual(
      'Dies ist mein Text, geschrieben um 12 und später',
    )
    expect(prepareText('12:30 Uhr')).toEqual('12:30')
    expect(prepareText('3 Uhr')).toEqual('3')
    expect(prepareText('Dies ist mein Text, geschrieben um 12Uhr und später')).toEqual(
      'Dies ist mein Text, geschrieben um 12 und später',
    )
  })

  it('should not strip Uhr from other sentences', () => {
    Platform.OS = 'android'
    expect(prepareText('Die 12 Uhrzeiten')).toEqual('Die 12 Uhrzeiten')
    expect(prepareText('Die Uhr ist rund')).toEqual('Die Uhr ist rund')
    expect(prepareText('Es ist 12, das ist auf der Uhr oben.')).toEqual('Es ist 12, das ist auf der Uhr oben.')
  })

  it('should not strip Uhr from tts sentences on ios', () => {
    Platform.OS = 'ios'
    expect(prepareText('Dies ist mein Text, geschrieben um 12Uhr und später')).toEqual(
      'Dies ist mein Text, geschrieben um 12Uhr und später',
    )
  })
})
