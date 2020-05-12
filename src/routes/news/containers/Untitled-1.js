// // @flow

// import React from 'react'

// import styled from 'styled-components/native'
// import TileModel from '../models/TileModel'
// import type { ThemeType } from '../../theme/constants/theme'
// import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
// import NavigationTile from './NavigationTile'
// import { ScrollView, Dimensions } from 'react-native'

// //  Utils
// const WIDTH_BREAK_POINT = 375
// const ANCHOR_WIDTH = 60
// const ITEMS_COUNT_FOR_SMALL_SCREENS = 3
// const ITEMS_COUNT_FOR_LARGE_SCREENS = 4
// const isScreenWide = width => width >= WIDTH_BREAK_POINT
// const getAnchorWidth = isWideScreen => (isWideScreen ? 0 : ANCHOR_WIDTH)
// const getItemWidth = (isWideScreen, scrollViewWidth) =>
//   isWideScreen ? scrollViewWidth / ITEMS_COUNT_FOR_LARGE_SCREENS : scrollViewWidth / ITEMS_COUNT_FOR_SMALL_SCREENS

// const screenWidth = Dimensions.get('screen').width
// const screenHeight = Dimensions.get('screen').height
// let isWideScreen = isScreenWide(screenWidth)
// let anchorWidth = getAnchorWidth(isWideScreen)
// let scrollViewWidth = screenWidth - anchorWidth
// let itemWidth = getItemWidth(isWideScreen, scrollViewWidth)
// const getOrientation = (height, width) => height >= width ? 'portrait' : 'landscape'

// type PropsType = {|
//   tiles: TileModel[],
//   theme: ThemeType
// |}

// const TilesRow = styled.View`
//   background-color: ${props => props.theme.colors.backgroundAccentColor};
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   justify-content: space-around;
//   elevation: 1;
//   shadow-color: #000000;
//   shadow-opacity: 0.2;
//   shadow-radius: 1px;
//   shadow-offset: 1px;
// `
// const Icon = styled(MaterialIcon)`
//   font-size: 30px;
//   width: ${props => props.width / 2}px;
// `
// /**
//  * Displays a table of NavigationTiles
//  */
// class NavigationTiles extends React.Component<PropsType> {
//   state = {
//     xPosition: 0,
//     isWideScreen,
//     screenWidth: screenWidth,
//     scrollViewWidth,
//     itemWidth: itemWidth,
//     anchorWidth: anchorWidth,
//     orientation: getOrientation(screenHeight, screenWidth)
//   };

//   ref_ = null;

//   componentDidMount () {
//     Dimensions.addEventListener('change', ({ width, height }) => {
//       const orientation = getOrientation(height, width)
//       if (orientation !== this.state.orientation) {
//         console.log({ state: this.state })

//         this.calculateNavigationItemWidth(orientation)
//       }
//     })
//   }

//   onRightAnchorPress = () => {
//     const { xPosition, itemWidth } = this.state
//     if (!xPosition) {
//       this.ref_.scrollToEnd({ animated: true })
//     } else {
//       this.ref_.scrollTo({ y: 0, x: xPosition - itemWidth, animated: true })
//     }
//   };

//   calculateNavigationItemWidth (orientation: string) {
//     const { screenWidth } = this.state

//     console.log('calculateNavigationItemWidth')
//     isWideScreen = isScreenWide(screenWidth)
//     anchorWidth = getAnchorWidth(isWideScreen)
//     scrollViewWidth = screenWidth - anchorWidth
//     itemWidth = getItemWidth(isWideScreen, scrollViewWidth)

//     this.setState({
//       isWideScreen,
//       screenWidth: screenWidth,
//       scrollViewWidth: scrollViewWidth,
//       itemWidth: itemWidth,
//       anchorWidth: anchorWidth,
//       orientation
//     }, () => {
//       console.log({ nextState: this.state })
//     })
//   }

//   onLeftAnchorPress = () => {
//     const { xPosition, itemWidth } = this.state
//     if (!xPosition) {
//       this.ref_ && this.ref_.scrollToEnd({ animated: true })
//     } else {
//       this.ref_ && this.ref_.scrollTo({ y: 0, x: xPosition - itemWidth, animated: true })
//     }
//   };

//   setRef = ref => {
//     this.ref_ = ref
//   };

//   onMomentumScrollEnd = ({ nativeEvent }) => {
//     this.setState({ xPosition: nativeEvent.contentOffset.x })
//   };

//   checkIfOverFlow = (width, height) => {
//     console.log({ width, height, scrollViewWidth })
//   };

//   onLayout = ({ nativeEvent }) => {
//     this.setState({
//       screenWidth: nativeEvent.layout.width
//     })
//   }

//   render () {
//     const { tiles, theme } = this.props
//     const isMoreThanThreeItems = tiles.length > ITEMS_COUNT_FOR_SMALL_SCREENS
//     const { isWideScreen, scrollViewWidth, itemWidth, anchorWidth } = this.state
//     const shouldShowAnchorArrows = !isWideScreen && isMoreThanThreeItems

//     return (
//       <TilesRow theme={theme}>
//         {shouldShowAnchorArrows && (
//           <Icon
//             name='keyboard-arrow-left'
//             color={theme.colors.black}
//             onPress={this.onRightAnchorPress}
//             width={anchorWidth}
//           />
//         )}
//         <ScrollView
//           horizontal
//           ref={this.setRef}
//           onLayout={this.onLayout}
//           contentContainerStyle={{
//             flexGrow: 1,
//             justifyContent: 'space-between'
//           }}
//           style={{ width: scrollViewWidth }}
//           showsHorizontalScrollIndicator={false}
//           pagingEnabled
//           snapToInterval={itemWidth}
//           decelerationRate='fast'
//           bounces={false}
//           onMomentumScrollEnd={this.onMomentumScrollEnd}
//           snapToAlignment='center'>
//           {tiles.map(tile => (
//             <NavigationTile
//               key={tile.path}
//               tile={tile}
//               theme={theme}
//               width={itemWidth}
//             />
//           ))}
//         </ScrollView>
//         {shouldShowAnchorArrows && (
//           <Icon
//             name='keyboard-arrow-right'
//             color={theme.colors.black}
//             onPress={this.onLeftAnchorPress}
//             width={anchorWidth}
//           />
//         )}
//       </TilesRow>
//     )
//   }
// }

// export default NavigationTiles
