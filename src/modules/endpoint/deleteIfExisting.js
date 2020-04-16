// @flow

import RNFetchBlob from 'rn-fetch-blob'

// Android throws an error if attempting to delete non existing directories/files
// https://github.com/joltup/rn-fetch-blob/issues/333
const deleteIfExisting = async (path: string) => {
  if (await RNFetchBlob.fs.exists((path))) {
    await RNFetchBlob.fs.unlink(path)
  }
}

export default deleteIfExisting
