import MoreVertIcon from '@mui/icons-material/MoreVert'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import { dividerClasses } from '@mui/material/Divider'
import Grow from '@mui/material/Grow'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import MenuList from '@mui/material/MenuList'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import { styled } from '@mui/material/styles'
import React, {
  KeyboardEvent,
  ReactElement,
  ReactNode,
  RefObject,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'

import useLockedBody from '../../hooks/useLockedBody'

const MenuPaper = styled(Paper)({
  marginTop: 8,
  borderRadius: 16,
  maxHeight: 'calc(100vh - 96px)',
  overflowY: 'auto',

  [`& .${dividerClasses.root}`]: {
    margin: '0 !important',
  },
})

export type MenuRef = {
  closeMenu: () => void
}

type MenuProps = {
  icon?: ReactElement
  label?: string
  children: (closeMenu: () => void) => ReactNode
  id?: string
  buttonColor?: IconButtonProps['color']
  onEntered?: () => void
  // Necessary inside modal dialogs, as screen readers ignore everything outside of them
  disablePortal?: boolean
  ref?: RefObject<MenuRef | null>
}

// Not using MUI Menu, since its modal hides the rest of the page from screen readers, trapping e.g. TalkBack users
const Menu = ({
  icon = <MoreVertIcon />,
  label,
  children,
  id,
  buttonColor,
  onEntered,
  disablePortal = false,
  ref,
}: MenuProps): ReactElement => {
  // Use a separate boolean instead of setting the ref to null, otherwise the menu jumps to the top left during the exit transition
  const [open, setOpen] = useState<boolean>(false)
  const anchorRef = useRef<HTMLButtonElement>(null)
  const { t } = useTranslation()
  const generatedId = useId()
  const menuId = `${id ?? generatedId}-panel`
  useLockedBody(open)

  const closeMenu = () => {
    anchorRef.current?.focus()
    setOpen(false)
  }

  useImperativeHandle(ref, () => ({ closeMenu }))

  const handleClickAway = (event: MouseEvent | TouchEvent) => {
    // Clicks on the menu button are handled by toggleMenu, otherwise a tap would directly reopen it
    if (!anchorRef.current?.contains(event.target as Node)) {
      setOpen(false)
    }
  }

  const toggleMenu = () => setOpen(!open)

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.stopPropagation()
    }
    if (event.key === 'Escape' || event.key === 'Tab') {
      closeMenu()
    }
  }

  return (
    <>
      <IconButton
        ref={anchorRef}
        id={id}
        color={buttonColor}
        onClick={toggleMenu}
        aria-label={label ?? t($ => $.common.labels.menu)}
        aria-expanded={open}
        aria-haspopup='menu'
        aria-controls={open ? menuId : undefined}>
        {icon}
      </IconButton>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement='bottom-start'
        transition
        disablePortal={disablePortal}
        sx={{ zIndex: theme => theme.zIndex.appBar + 1 }}>
        {({ TransitionProps: transitionProps }) => (
          <Grow {...transitionProps} onEntered={onEntered}>
            <MenuPaper elevation={8}>
              <ClickAwayListener onClickAway={handleClickAway}>
                <MenuList id={menuId} autoFocusItem={open} onKeyDown={handleKeyDown} disabledItemsFocusable>
                  {children(closeMenu)}
                </MenuList>
              </ClickAwayListener>
            </MenuPaper>
          </Grow>
        )}
      </Popper>
    </>
  )
}

export default Menu
