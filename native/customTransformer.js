/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line import/no-extraneous-dependencies
const upstreamTransformer = require('metro-react-native-babel-transformer')
// eslint-disable-next-line import/no-extraneous-dependencies
const svgTransformer = require('react-native-svg-transformer')

module.exports.transform = ({ src, filename, options }) => {
  if (filename.endsWith('.svg') && !filename.includes('mapbox')) {
    return svgTransformer.transform({ src, filename, options })
  }
  return upstreamTransformer.transform({ src, filename, options })
}
