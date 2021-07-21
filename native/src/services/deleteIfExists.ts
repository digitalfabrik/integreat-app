import RNFetchBlob from 'rn-fetch-blob'

// Android throws an error if attempting to delete non existing directories/files
// https://github.com/joltup/rn-fetch-blob/issues/333
const deleteIfExists = async (path: string): Promise<void> => {
  if (await RNFetchBlob.fs.exists(path)) {
    await RNFetchBlob.fs.unlink(path)
  } else {
    // eslint-disable-next-line no-console
    console.warn(`File or directory ${path} does not exist and was therefore not deleted.`)
  }
}

export default deleteIfExists
