import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import useDimensions from '../hooks/useDimensions'
import useOnClickOutside from '../hooks/useOnClickOutside'
import HeaderActionItem from './HeaderActionItem'
import LanguageList, { LanguageChangePath } from './LanguageList'
import Sidebar from './Sidebar'

const Wrapper = styled('div')`
  display: contents;
`

type HeaderLanguageSelectorItemProps = {
  languageChangePaths: LanguageChangePath[]
  languageCode: string
  forceText?: boolean
}

const HeaderLanguageSelectorItem = ({
  languageChangePaths,
  languageCode,
  forceText = false,
}: HeaderLanguageSelectorItemProps): ReactElement => {
  const [open, setOpen] = useState(false)
  const { mobile, desktop } = useDimensions()
  const { t } = useTranslation('layout')
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  useOnClickOutside(wrapperRef, () => setOpen(false))

  const currentLanguageName = languageChangePaths.find(item => item.code === languageCode)?.name

  const ChangeLanguageButton = (
    <HeaderActionItem
      key='languageChange'
      onClick={() => setOpen(open => !open)}
      text={open ? '' : t('changeLanguage') /* to not cover the dropdown with the tooltip */}
      icon={<TranslateOutlinedIcon />}
      innerText={forceText || desktop ? currentLanguageName : undefined}
    />
  )

  if (mobile) {
    return (
      <Sidebar OpenButton={ChangeLanguageButton} setOpen={setOpen} open={open}>
        <LanguageList
          languageChangePaths={languageChangePaths}
          languageCode={languageCode}
          close={() => setOpen(false)}
        />
      </Sidebar>
    )
  }

  return (
    <Wrapper ref={wrapperRef}>
      {ChangeLanguageButton}
      {open && (
        <LanguageList
          languageChangePaths={languageChangePaths}
          languageCode={languageCode}
          close={() => setOpen(false)}
        />
      )}
    </Wrapper>
  )
}

export default HeaderLanguageSelectorItem
