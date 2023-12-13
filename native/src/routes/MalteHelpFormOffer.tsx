import React, { ReactElement } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { MalteHelpFormOfferRouteType } from 'api-client'

import { SecurityIcon, SupportIcon } from '../assets'
import Caption from '../components/Caption'
import HorizontalLine from '../components/HorizontalLine'
import LayoutedScrollView from '../components/LayoutedScrollView'
import Icon from '../components/base/Icon'
import Text from '../components/base/Text'
import TextButton from '../components/base/TextButton'
import FormInput from '../components/form/FormInput'
import FormRadioButtons from '../components/form/FormRadioButtons'
import { NavigationProps } from '../constants/NavigationTypes'
import useSnackbar from '../hooks/useSnackbar'

const Container = styled(LayoutedScrollView)`
  padding: 0 16px 16px;
  gap: 16px;
`

const InformationRow = styled.View`
  flex-direction: row;
  gap: 8px;
`

const InformationText = styled.Text`
  flex: 1;
`

const InputTitle = styled.Text`
  font-weight: bold;
`

const StyledHorizontalLine = styled(HorizontalLine)`
  margin: 8px 0;
`

type FormInput = {
  name: string
  roomNumber: string
  email: string
  telephone: string
  contactChannel: 'email' | 'telephone' | 'person'
  contactGender: 'female' | 'male' | 'any'
  comment: string
}

const defaultValues: FormInput = {
  name: '',
  roomNumber: '',
  email: '',
  telephone: '',
  contactChannel: 'email',
  contactGender: 'any',
  comment: '',
}

type MalteHelpFormOfferProps = {
  navigation: NavigationProps<MalteHelpFormOfferRouteType>
}

const MalteHelpFormOffer = ({ navigation }: MalteHelpFormOfferProps): ReactElement => {
  const { control, handleSubmit, formState } = useForm<FormInput>({ defaultValues })
  const { t } = useTranslation('malteHelpForm')
  const showSnackbar = useSnackbar()

  const onSubmit = handleSubmit(_data => {
    try {
      // TODO submit form
      // handleSubmit()
      navigation.goBack()
      showSnackbar({ text: t('submitSuccessful') })
    } catch (e) {
      showSnackbar({ text: t('error:unknownError') })
    }
  })

  return (
    <Container>
      <Caption title={t('title')} />

      <InformationRow>
        <Icon Icon={SupportIcon} />
        <InformationText>{t('supportNote')}</InformationText>
      </InformationRow>
      <InformationRow>
        <Icon Icon={SecurityIcon} />
        <InformationText>{t('securityNote')}</InformationText>
      </InformationRow>

      <FormInput name='name' title={t('name')} control={control} rules={{ required: true }} />
      <FormInput name='roomNumber' title={t('roomNumber')} control={control} showOptional />

      <InputTitle>{t('howToBeContacted')}</InputTitle>
      <FormRadioButtons
        name='contactChannel'
        control={control}
        values={[
          { key: 'email', label: t('eMail'), inputName: 'email' },
          { key: 'telephone', label: t('telephone'), inputName: 'telephone' },
          { key: 'personal', label: t('personal') },
        ]}
      />

      <StyledHorizontalLine />

      <InputTitle>{t('contactPerson')}</InputTitle>
      <FormRadioButtons
        name='contactGender'
        control={control}
        values={[
          { key: 'any', label: t('any') },
          { key: 'female', label: t('female') },
          { key: 'male', label: t('male') },
        ]}
      />

      <StyledHorizontalLine />

      <InputTitle>{t('contactReason')}</InputTitle>
      {/* TODO Extract to shared constant */}
      <FormInput name='comment' control={control} rules={{ maxLength: 200 }} multiline />

      <Text>{t('responseDisclaimer')}</Text>
      <TextButton text={t('submit')} onPress={onSubmit} disabled={!formState.isValid} />
    </Container>
  )
}

export default MalteHelpFormOffer
