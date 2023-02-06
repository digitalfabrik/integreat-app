const DEFAULT_LENGTH = 20
// TODO IGAPP-1226: Replace by UID from CMS
const generateUID = (length = DEFAULT_LENGTH): string => {
  let generatedID = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i += 1) {
    generatedID += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return `${generatedID}`
}
export default generateUID
