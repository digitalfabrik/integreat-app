import React, { ReactElement } from 'react'
import { StyleSheet } from 'react-native'
import { Divider, List as PaperList } from 'react-native-paper'
import { useTheme } from 'styled-components/native'

type CityGroupProps = {
  children: string
}

const CityGroup = ({ children }: CityGroupProps): ReactElement => {
  const theme = useTheme()
  const styles = StyleSheet.create({
    subheader: {
      color: theme.colors.onSurfaceVariant,
      paddingVertical: 8,
      fontFamily: theme.fonts.h6.fontFamily,
    },
  })

  return (
    <>
      <Divider />
      <PaperList.Subheader style={styles.subheader}>{children}</PaperList.Subheader>
    </>
  )
}

export default CityGroup
