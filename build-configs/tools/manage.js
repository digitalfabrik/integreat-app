const program = require('commander')
const fs = require('fs')
const flat = require('flat')
const decamelize = require('decamelize')
const loadBuildConfig = require('../index').default

const loadBuildConfigAsXCConfig = (buildConfigName, platform) => {
  const buildConfig = loadBuildConfig(buildConfigName, platform)
  const xcconfigOptions = flat(buildConfig, {
    delimiter: '_',
    transformKey: key => decamelize(key).toUpperCase()
  })
  const prefixed = Object.keys(xcconfigOptions).map(key => {
    const value = xcconfigOptions[key]
    const escaped = typeof value === 'string' ? value.replace(/\n/g, '\\n') : value
    return `BUILD_CONFIG_${key} = ${escaped}`
  })
  prefixed.push(`BUILD_CONFIG_NAME = ${buildConfigName}`)
  return prefixed.join('\n')
}

program
  .command('write-xcconfig <build_config_name> <platform>')
  .requiredOption('--directory <directory>', 'the directory to put the created xcconfig file in')
  .description('create and write a new .xcconfig from the iosBuildOptions of the specified build config')
  .action((buildConfigName, platform, cmdObj) => {
    try {
      const xcconfig = loadBuildConfigAsXCConfig(buildConfigName, platform)
      fs.writeFileSync(`${cmdObj.directory}/buildConfig.tmp.xcconfig`, xcconfig)
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  })

program
  .command('to-xcconfig <build_config_name> <platform>')
  .description('outputs the specified build config as XConfig')
  .action((buildConfigName, platform) => {
    try {
      const xcconfig = loadBuildConfigAsXCConfig(buildConfigName, platform)
      console.log(xcconfig)
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  })

program
  .command('to-json <build_config_name> <platform>')
  .description('outputs the specified build config as JSON')
  .action((buildConfigName, platform) => {
    const buildConfig = loadBuildConfig(buildConfigName, platform)
    console.log(JSON.stringify(buildConfig))
  })

program.parse(process.argv)
