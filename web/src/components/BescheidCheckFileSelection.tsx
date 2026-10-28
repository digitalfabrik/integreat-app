import shouldForwardProp from '@emotion/is-prop-valid'
import AddIcon from '@mui/icons-material/Add'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import DescriptionIcon from '@mui/icons-material/Description'
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined'
import ImageIcon from '@mui/icons-material/Image'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { alpha, styled } from '@mui/material/styles'
import React, { ChangeEvent, DragEvent, ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import useDimensions from '../hooks/useDimensions'
import Link from './base/Link'

const MAX_FILES = 10
const MAX_FILE_SIZE_MB = 20
const BYTES_PER_MB = 1_048_576
const ACCEPTED_FILE_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.heic']
const BACKGROUND_OPACITY = 0.2

const Container = styled(Stack, { shouldForwardProp })<{ dragging: boolean }>(({ theme, dragging }) => ({
  alignItems: 'center',
  gap: 16,
  padding: 24,
  borderRadius: 16,
  border: `1px solid ${dragging ? theme.palette.primary.main : theme.palette.divider}`,
  backgroundColor: dragging
    ? theme.palette.background.accent
    : alpha(theme.palette.background.accent, BACKGROUND_OPACITY),
  transition: theme.transitions.create(['border-color', 'background-color']),
}))

const VisuallyHiddenInput = styled('input')({
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

const StyledList = styled(List)({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  width: '100%',
  maxWidth: 400,
})

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: 8,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  overflow: 'hidden',
}))

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 64,
  height: 64,
  backgroundColor: theme.palette.background.accent,
  color: theme.palette.primary.main,
}))

export type SelectedFile = {
  file: File
  url: string
}

type RejectedFileNames = {
  unsupportedType: string[]
  tooLarge: string[]
  tooMany: string[]
}

const noRejectedFileNames: RejectedFileNames = { unsupportedType: [], tooLarge: [], tooMany: [] }

// Checking the extension instead of the mime type, since browsers often report an empty type for heic files
const hasExtension = (file: File, extensions: string[]): boolean =>
  extensions.some(extension => file.name.toLowerCase().endsWith(extension))

const isSupported = (file: File): boolean => hasExtension(file, ACCEPTED_FILE_EXTENSIONS)

const isTooLarge = (file: File): boolean => file.size > MAX_FILE_SIZE_MB * BYTES_PER_MB

type FileInputButtonProps = {
  label: string
  icon: ReactElement
  variant: 'contained' | 'outlined'
  onSelect: (files: File[]) => void
  capture?: boolean
}

const FileInputButton = ({ label, icon, variant, onSelect, capture = false }: FileInputButtonProps): ReactElement => {
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target
    onSelect(Array.from(input.files ?? []))
    // Reset the input to allow selecting the same file again
    input.value = ''
  }

  return (
    <Button component='label' role={undefined} tabIndex={-1} variant={variant} startIcon={icon}>
      {label}
      <VisuallyHiddenInput
        type='file'
        accept={capture ? 'image/*' : ACCEPTED_FILE_EXTENSIONS.join(',')}
        capture={capture ? 'environment' : undefined}
        multiple={!capture}
        onChange={onChange}
      />
    </Button>
  )
}

type SelectedFileListItemProps = {
  selectedFile: SelectedFile
  remove: () => void
}

const SelectedFileListItem = ({ selectedFile, remove }: SelectedFileListItemProps): ReactElement => {
  const { t } = useTranslation()
  const { file, url } = selectedFile
  const FileIcon = hasExtension(file, ['.pdf']) ? PictureAsPdfIcon : ImageIcon

  return (
    <StyledListItem disablePadding>
      <ListItemButton component={Link} to={url} sx={{ gap: 1 }}>
        <FileIcon color='primary' />
        <ListItemText primary={<Typography variant='subtitle2'>{file.name}</Typography>} />
      </ListItemButton>
      <Button onClick={remove} startIcon={<DeleteOutlinedIcon />} size='small' sx={{ flexShrink: 0, marginInline: 1 }}>
        {t($ => $.common.actions.remove)}
      </Button>
    </StyledListItem>
  )
}

type BescheidCheckFileSelectionProps = {
  files: SelectedFile[]
  setFiles: (files: SelectedFile[]) => void
}

const BescheidCheckFileSelection = ({ files, setFiles }: BescheidCheckFileSelectionProps): ReactElement => {
  const { t } = useTranslation()
  const { mobile } = useDimensions()
  const [rejectedFileNames, setRejectedFileNames] = useState<RejectedFileNames>(noRejectedFileNames)
  const [dragging, setDragging] = useState(false)

  const addFiles = (newFiles: File[]) => {
    const getName = (file: File) => file.name
    const supportedFiles = newFiles.filter(isSupported)
    const validFiles = supportedFiles.filter(file => !isTooLarge(file))
    const remainingCount = MAX_FILES - files.length

    setRejectedFileNames({
      unsupportedType: newFiles.filter(file => !isSupported(file)).map(getName),
      tooLarge: supportedFiles.filter(isTooLarge).map(getName),
      tooMany: validFiles.slice(remainingCount).map(getName),
    })
    setFiles([...files, ...validFiles.slice(0, remainingCount).map(file => ({ file, url: URL.createObjectURL(file) }))])
  }

  const removeFile = ({ url }: SelectedFile) => {
    URL.revokeObjectURL(url)
    setFiles(files.filter(file => file.url !== url))
    setRejectedFileNames(noRejectedFileNames)
  }

  const onDragOver = (event: DragEvent) => {
    event.preventDefault()
    setDragging(true)
  }

  const onDragLeave = (event: DragEvent) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setDragging(false)
    }
  }

  const onDrop = (event: DragEvent) => {
    event.preventDefault()
    setDragging(false)
    addFiles(Array.from(event.dataTransfer.files))
  }

  const { unsupportedType, tooLarge, tooMany } = rejectedFileNames
  const errorMessages = [
    unsupportedType.length > 0 &&
      t($ => $.bescheidCheck.errors.unsupportedType, { fileNames: unsupportedType.join(', ') }),
    tooLarge.length > 0 &&
      t($ => $.bescheidCheck.errors.tooLarge, { fileNames: tooLarge.join(', '), maxSize: MAX_FILE_SIZE_MB }),
    tooMany.length > 0 &&
      t($ => $.bescheidCheck.errors.tooMany, { fileNames: tooMany.join(', '), maxFiles: MAX_FILES }),
  ].filter(message => message !== false)

  return (
    <Container dragging={dragging} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
      {files.length > 0 ? (
        <>
          <Typography variant='subtitle2' component='h2'>
            {t($ => $.bescheidCheck.upload.yourFiles)}
          </Typography>
          <StyledList disablePadding>
            {files.map(file => (
              <SelectedFileListItem key={file.url} selectedFile={file} remove={() => removeFile(file)} />
            ))}
          </StyledList>
          <FileInputButton
            label={t($ => $.bescheidCheck.upload.addPages)}
            icon={<AddIcon />}
            variant='outlined'
            onSelect={addFiles}
          />
        </>
      ) : (
        <>
          <Stack direction={{ xs: 'row', md: 'column' }} sx={{ alignItems: 'center', gap: 2 }}>
            <StyledAvatar>
              <FileUploadOutlinedIcon sx={{ fontSize: 32 }} />
            </StyledAvatar>
            <Stack sx={{ alignItems: { md: 'center' }, gap: 1 }}>
              <Typography variant='subtitle1' component='h2'>
                {mobile ? t($ => $.bescheidCheck.upload.title) : t($ => $.bescheidCheck.upload.dropTitle)}
              </Typography>
              <Typography variant='body3'>{t($ => $.bescheidCheck.upload.limits, { maxFiles: MAX_FILES })}</Typography>
            </Stack>
          </Stack>
          <Stack sx={{ gap: 1, width: { xs: '100%', md: 'auto' } }}>
            {mobile && (
              <FileInputButton
                label={t($ => $.bescheidCheck.upload.takePhoto)}
                icon={<CameraAltIcon />}
                variant='contained'
                onSelect={addFiles}
                capture
              />
            )}
            <FileInputButton
              label={t($ => $.bescheidCheck.upload.selectFiles)}
              icon={<DescriptionIcon />}
              variant={mobile ? 'outlined' : 'contained'}
              onSelect={addFiles}
            />
          </Stack>
          <Typography variant='body2' sx={{ alignSelf: 'stretch', color: 'text.secondary' }}>
            {t($ => $.bescheidCheck.upload.hint)}
          </Typography>
        </>
      )}
      {errorMessages.map(message => (
        <Alert key={message} severity='error' sx={{ alignSelf: 'stretch' }}>
          {message}
        </Alert>
      ))}
    </Container>
  )
}

export default BescheidCheckFileSelection
