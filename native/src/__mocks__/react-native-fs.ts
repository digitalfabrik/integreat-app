import path from 'path'

type MockFilesType = Record<string, string>
const mockFiles: MockFilesType = {}

const deleteAllMockFiles = () => {
  Object.keys(mockFiles).forEach(path => {
    delete mockFiles[path]
  })
}

const writeMockFile = (file: string, content: string, _unusedEncoding: string): Promise<void> => {
  const filePath = path.normalize(file)
  mockFiles[filePath] = content
  return Promise.resolve()
}

const readMockFile = (file: string, _unusedEncoding: string): Promise<string> => {
  const filePath = path.normalize(file)
  return Promise.resolve(mockFiles[filePath] || '')
}

const existsMock = (file: string): Promise<boolean> => {
  const filePath = path.normalize(file)
  const exists = filePath in mockFiles
  const isParentOfExisting = Object.keys(mockFiles).some(filePath => filePath.startsWith(file))
  return Promise.resolve(exists || isParentOfExisting)
}

const statMock = (path: string): Promise<{ isDirectory: () => boolean }> => {
  const filePath = path.normalize(path)
  const exists = filePath in mockFiles
  const isParentOfExisting = Object.keys(mockFiles).some(filePath => filePath.startsWith(path))

  if (exists || isParentOfExisting) {
    return Promise.resolve({
      isDirectory: () => isParentOfExisting && !exists,
    })
  }

  return Promise.reject(new Error(`File ${path} does not exist`))
}

const mkdirMock = (): Promise<void> => {
  return Promise.resolve()
}

/**
 * Delete a file or an entire folder at path. Note that there will be no error if the file to be deleted does not exist
 * @param file
 * @return {Promise<void>}
 */
const unlinkMock = (file: string): Promise<void> => {
  const filePath = path.normalize(file)
  Object.keys(mockFiles).forEach(path => {
    const slicedPath = path.slice(0, filePath.length)

    // Delete file if paths are matching or file is an ancestor directory
    if (filePath === path || (filePath === slicedPath && path[filePath.length] === '/')) {
      delete mockFiles[path]
    }
  })
  return Promise.resolve()
}

export const DocumentDirectoryPath = 'path/to/documentDir'
export const exists = jest.fn<Promise<boolean>, [string]>(existsMock)
export const stat = jest.fn<Promise<{ isDirectory: () => boolean }>, [string]>(statMock)
export const writeFile = jest.fn<Promise<void>, [string, string, string]>(writeMockFile)
export const readFile = jest.fn<Promise<string>, [string, string]>(readMockFile)
export const unlink = jest.fn<Promise<void>, [string]>(unlinkMock)
export const mkdir = jest.fn<Promise<void>, [string, any?]>(mkdirMock)
export const _reset = deleteAllMockFiles
