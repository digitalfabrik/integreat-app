import { fireEvent } from '@testing-library/react'
import React from 'react'

import { mockDimensions } from '../../hooks/__mocks__/useDimensions'
import useDimensions from '../../hooks/useDimensions'
import { renderWithRouterAndTheme } from '../../testing/render'
import BescheidCheckFileSelection, { SelectedFile } from '../BescheidCheckFileSelection'

jest.mock('../../hooks/useDimensions')

const createFile = (name: string, size = 1024): File => {
  const file = new File(['content'], name)
  Object.defineProperty(file, 'size', { value: size })
  return file
}

const createSelectedFile = (name: string): SelectedFile => ({ file: createFile(name), url: `blob:${name}` })

describe('BescheidCheckFileSelection', () => {
  const { mocked } = jest
  const setFiles = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mocked(useDimensions).mockReturnValue({ ...mockDimensions, mobile: false, desktop: true })
    mocked(URL.createObjectURL).mockImplementation(file => `blob:${(file as File).name}`)
  })

  const renderFileSelection = (files: SelectedFile[] = []) =>
    renderWithRouterAndTheme(<BescheidCheckFileSelection files={files} setFiles={setFiles} />)

  const selectFiles = (input: HTMLElement, files: File[]) => fireEvent.change(input, { target: { files } })

  it('should only show the take photo button on mobile', () => {
    const { queryByText, getByText, unmount } = renderFileSelection()

    expect(getByText('bescheidCheck:upload.selectFiles')).toBeTruthy()
    expect(queryByText('bescheidCheck:upload.takePhoto')).toBeNull()
    unmount()

    mocked(useDimensions).mockReturnValue(mockDimensions)
    const { getByLabelText } = renderFileSelection()

    expect(getByLabelText('bescheidCheck:upload.selectFiles')).toHaveAttribute('multiple')
    expect(getByLabelText('bescheidCheck:upload.takePhoto')).toHaveAttribute('capture', 'environment')
  })

  it('should add selected files', () => {
    const { getByLabelText, queryByRole } = renderFileSelection()
    const files = [createFile('page1.pdf'), createFile('page2.JPG'), createFile('page3.heic')]

    selectFiles(getByLabelText('bescheidCheck:upload.selectFiles'), files)

    expect(setFiles).toHaveBeenCalledWith(files.map(file => ({ file, url: `blob:${file.name}` })))
    expect(queryByRole('alert')).toBeNull()
  })

  it('should add dropped files', () => {
    const { getByText } = renderFileSelection()
    const file = createFile('page1.pdf')

    fireEvent.drop(getByText('bescheidCheck:upload.dropTitle'), { dataTransfer: { files: [file] } })

    expect(setFiles).toHaveBeenCalledWith([{ file, url: 'blob:page1.pdf' }])
  })

  it('should not add files with unsupported types', () => {
    const { getByLabelText, getByRole } = renderFileSelection()
    const validFile = createFile('page1.png')

    selectFiles(getByLabelText('bescheidCheck:upload.selectFiles'), [validFile, createFile('letter.docx')])

    expect(setFiles).toHaveBeenCalledWith([{ file: validFile, url: 'blob:page1.png' }])
    expect(getByRole('alert')).toHaveTextContent('bescheidCheck:errors.unsupportedType letter.docx')
  })

  it('should not add files that are too large', () => {
    const { getByLabelText, getByRole } = renderFileSelection()

    selectFiles(getByLabelText('bescheidCheck:upload.selectFiles'), [createFile('scan.pdf', 21 * 1024 * 1024)])

    expect(setFiles).toHaveBeenCalledWith([])
    expect(getByRole('alert')).toHaveTextContent('bescheidCheck:errors.tooLarge')
    expect(getByRole('alert')).toHaveTextContent('scan.pdf')
  })

  it('should not add more than 10 files across multiple selections', () => {
    const existingFiles = Array.from({ length: 9 }, (_, index) => createSelectedFile(`page${index}.jpg`))
    const { getByLabelText, getByRole } = renderFileSelection(existingFiles)
    const newFile = createFile('page9.jpg')

    selectFiles(getByLabelText('bescheidCheck:upload.addPages'), [newFile, createFile('page10.jpg')])

    expect(setFiles).toHaveBeenCalledWith([...existingFiles, { file: newFile, url: 'blob:page9.jpg' }])
    expect(getByRole('alert')).toHaveTextContent('bescheidCheck:errors.tooMany')
    expect(getByRole('alert')).toHaveTextContent('page10.jpg')
  })

  it('should list selected files with a link to open them', () => {
    const { getByRole } = renderFileSelection([createSelectedFile('page1.pdf'), createSelectedFile('page2.png')])

    expect(getByRole('link', { name: 'page1.pdf' })).toHaveAttribute('href', 'blob:page1.pdf')
    expect(getByRole('link', { name: 'page2.png' })).toHaveAttribute('href', 'blob:page2.png')
  })

  it('should remove files', () => {
    const files = [createSelectedFile('page1.pdf'), createSelectedFile('page2.png')]
    const { getAllByText } = renderFileSelection(files)

    fireEvent.click(getAllByText('common:actions.remove')[0]!)

    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:page1.pdf')
    expect(setFiles).toHaveBeenCalledWith([files[1]])
  })
})
