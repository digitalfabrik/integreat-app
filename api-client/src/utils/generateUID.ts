const DEFAULT_LENGTH = 20
const generateUID = (length = DEFAULT_LENGTH): string => {
  let generatedID = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i += 1) {
    generatedID += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return `${generatedID}`
}
export default generateUID
