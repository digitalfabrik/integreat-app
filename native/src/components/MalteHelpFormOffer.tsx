import React, { ReactElement, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Button } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import {
  ContactChannel,
  ContactGender,
  InvalidEmailError,
  OfferModel,
  submitMalteHelpForm,
  MALTE_HELP_FORM_MAX_COMMENT_LENGTH,
} from 'shared/api'

import useKeyboardHeight from '../hooks/useKeyboardHeight'
import useRegionAppContext from '../hooks/useRegionAppContext'
import useSnackbar from '../hooks/useSnackbar'
import LayoutedScrollView from './LayoutedScrollView'
import PrivacyCheckbox from './PrivacyCheckbox'
import Icon from './base/Icon'
import Text from './base/Text'
import FormInput from './form/FormInput'
import FormRadioButtons from './form/FormRadioButtons'

const Container = styled(LayoutedScrollView)`
  padding: 16px;
  gap: 16px;
`

const InformationRow = styled.View`
  flex-direction: row;
  gap: 8px;
`

type FormInput = {
  name: string
  roomNumber: string
  email: string
  telephone: string
  contactChannel: ContactChannel
  contactGender: ContactGender
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
  categoryPageTitle: string
  url: string
  malteHelpFormOffer: OfferModel
  onSubmit: () => void
  regionCode: string
}

const MalteHelpFormOffer = ({
  categoryPageTitle,
  url,
  regionCode,
  malteHelpFormOffer,
  onSubmit,
}: MalteHelpFormOfferProps): ReactElement => {
  const { control, handleSubmit, formState, setError } = useForm<FormInput>({
    mode: 'onBlur',
    progressive: true,
    defaultValues,
  })
  const { t } = useTranslation()
  const { languageCode } = useRegionAppContext()
  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false)
  const showSnackbar = useSnackbar()

  const submit = handleSubmit(async (data: FormInput) => {
    try {
      await submitMalteHelpForm({
        url,
        pageTitle: categoryPageTitle,
        regionCode,
        malteHelpFormOffer,
        name: data.name,
        roomNumber: data.roomNumber,
        email: data.email,
        telephone: data.telephone,
        contactChannel: data.contactChannel,
        contactGender: data.contactGender,
        comment: data.comment,
      })
      onSubmit()
      showSnackbar({ text: t($ => $.malteHelpForm.submitSuccessful) })
    } catch (e) {
      if (e instanceof InvalidEmailError) {
        setError('email', { type: 'custom', message: t($ => $.malteHelpForm.invalidEmailAddress) })
        showSnackbar({ text: t($ => $.malteHelpForm.invalidEmailAddress) })
      } else {
        showSnackbar({ text: t($ => $.error.unknownError) })
      }
    }
  })

  const keyboardHeight = useKeyboardHeight()

  return (
    <KeyboardAwareScrollView extraHeight={keyboardHeight - useSafeAreaInsets().bottom}>
      <Container>
        <InformationRow>
          <Icon source='account-multiple-outline' />
          <Text variant='body2' style={{ flex: 1 }}>
            {t($ => $.malteHelpForm.supportNote)}
          </Text>
        </InformationRow>
        <InformationRow>
          <Icon source='shield-plus-outline' />
          <Text variant='body2' style={{ flex: 1 }}>
            {t($ => $.malteHelpForm.securityNote)}
          </Text>
        </InformationRow>

        <FormInput name='name' title={t($ => $.malteHelpForm.name)} control={control} rules={{ required: true }} />
        <FormInput name='roomNumber' title={t($ => $.malteHelpForm.roomNumber)} control={control} showOptional />

        <View>
          <Text variant='h6'>{t($ => $.malteHelpForm.howToBeContacted)}</Text>
          <FormRadioButtons
            name='contactChannel'
            control={control}
            values={[
              { key: 'email', label: t($ => $.malteHelpForm.eMail), inputName: 'email' },
              { key: 'telephone', label: t($ => $.malteHelpForm.telephone), inputName: 'telephone' },
              { key: 'personally', label: t($ => $.malteHelpForm.personally) },
            ]}
          />
        </View>

        <View>
          <Text variant='h6'>{t($ => $.malteHelpForm.contactPerson)}</Text>
          <FormRadioButtons
            name='contactGender'
            control={control}
            values={[
              { key: 'any', label: t($ => $.malteHelpForm.contactPersonAnyGender) },
              { key: 'female', label: t($ => $.malteHelpForm.contactPersonGenderFemale) },
              { key: 'male', label: t($ => $.malteHelpForm.contactPersonGenderMale) },
            ]}
          />
        </View>

        <FormInput
          name='comment'
          title={t($ => $.malteHelpForm.contactReason)}
          hint={t($ => $.malteHelpForm.maxCharacters, { numberOfCharacters: MALTE_HELP_FORM_MAX_COMMENT_LENGTH })}
          control={control}
          rules={{ maxLength: MALTE_HELP_FORM_MAX_COMMENT_LENGTH }}
          maxLength={MALTE_HELP_FORM_MAX_COMMENT_LENGTH}
          multiline
        />

        <Text variant='body2' style={{ flex: 1 }}>
          {t($ => $.malteHelpForm.responseHint)}
        </Text>
        <PrivacyCheckbox
          language={languageCode}
          checked={privacyPolicyAccepted}
          setChecked={setPrivacyPolicyAccepted}
        />
        <Button
          mode='contained'
          onPress={submit}
          disabled={!formState.isValid || formState.isSubmitting || !privacyPolicyAccepted}>
          {t($ => $.malteHelpForm.submit)}
        </Button>
      </Container>
    </KeyboardAwareScrollView>
  )
}

export default MalteHelpFormOffer
