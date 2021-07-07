import { Dimensions } from 'react-native'

export type DimensionsType = {
  headerHeight: number
  modalHeaderHeight: number
  categoryListItem: {
    iconSize: number
    margin: number
  }
  fontScaling: number
  deviceWidth: number
  headerTextSize: number
}
const dimensions: DimensionsType = {
  headerHeight: 60,
  modalHeaderHeight: 40,
  categoryListItem: {
    iconSize: 40,
    margin: 10
  },
  fontScaling: 0.04,
  deviceWidth: Number(Dimensions.get('window').width),
  headerTextSize: 20
}
export default dimensions
