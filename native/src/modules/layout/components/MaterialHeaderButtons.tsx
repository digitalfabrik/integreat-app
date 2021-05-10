import * as React from 'react'
import { defaultOnOverflowMenuPress, HeaderButton, HeaderButtons } from 'react-navigation-header-buttons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import type { ThemeType } from '../../theme/constants'

const MaterialHeaderButton = (props: {
  title: string
  onPress: () => void
  getButtonElement: () => React.ReactElement<any>
}) => <HeaderButton {...props} IconComponent={MaterialIcon} iconSize={23} color='black' />

// Adjust cancel label for ios overflow menu of HeaderButtons
const onOverflowMenuPress = (cancelButtonLabel: string) => ({ overflowButtonRef, hiddenButtons }) =>
  defaultOnOverflowMenuPress({
    overflowButtonRef,
    hiddenButtons,
    cancelButtonLabel
  })

const MaterialHeaderButtons = (props: { cancelLabel: string; children: React.ReactNode; theme: ThemeType }) => {
  const { cancelLabel, theme, ...otherProps } = props
  return (
    <HeaderButtons
      HeaderButtonComponent={MaterialHeaderButton}
      OverflowIcon={<MaterialIcon name='more-vert' size={23} color={theme.colors.textColor} />}
      onOverflowMenuPress={onOverflowMenuPress(cancelLabel)}
      {...otherProps}
    />
  )
}

export default MaterialHeaderButtons
