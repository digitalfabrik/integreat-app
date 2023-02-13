// mostly taken from https://github.com/sindresorhus/wait-for-localhost
// copy pasted as we do not use esm at the moment
import http from 'node:http'

const STATUS_CODE_OK = 200

const waitForLocalhost = (timeout: number): Promise<void> =>
  new Promise((resolve, reject) => {
    const request = http.request({ method: 'head', port: 9000, family: 4, timeout }, response => {
      if (response.statusCode === STATUS_CODE_OK) {
        resolve()
      }
      reject()
    })

    request.end()
  })

export default waitForLocalhost
