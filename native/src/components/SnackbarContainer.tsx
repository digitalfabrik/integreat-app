import React, { createContext, ReactElement, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Snackbar } from 'react-native-paper'

export type SnackbarActionType = {
  label: string
  onPress: () => void | Promise<void>
}
export type SnackbarType = {
  text: string
  action?: SnackbarActionType
  duration?: number
}

type SnackbarContextType = (snackbar: SnackbarType) => void
export const SnackbarContext = createContext<SnackbarContextType>(() => undefined)

type SnackbarContainerProps = {
  children: ReactElement
}

const SnackbarContainer = ({ children }: SnackbarContainerProps): ReactElement | null => {
  const [enqueuedSnackbars, setEnqueuedSnackbars] = useState<SnackbarType[]>([])
  const displayedSnackbar = enqueuedSnackbars[0]
  const { t } = useTranslation('error')

  const enqueueSnackbar = useCallback((snackbar: SnackbarType) => {
    // Don't show same snackbar multiple times
    setEnqueuedSnackbars(snackbars => (snackbars[0]?.text !== snackbar.text ? [...snackbars, snackbar] : snackbars))
  }, [])

  const onDismiss = useCallback(() => {
    setEnqueuedSnackbars(snackbars => snackbars.slice(1))
  }, [])

  return (
    <SnackbarContext.Provider value={enqueueSnackbar}>
      {children}
      <Snackbar
        key={displayedSnackbar?.text}
        visible={!!displayedSnackbar}
        onDismiss={onDismiss}
        onIconPress={onDismiss}
        duration={displayedSnackbar?.duration}
        action={
          displayedSnackbar?.action
            ? {
                label: displayedSnackbar.action.label,
                onPress: () => displayedSnackbar.action?.onPress(),
              }
            : undefined
        }>
        {displayedSnackbar ? t(displayedSnackbar.text) : ''}
      </Snackbar>
    </SnackbarContext.Provider>
  )
}

export default SnackbarContainer
