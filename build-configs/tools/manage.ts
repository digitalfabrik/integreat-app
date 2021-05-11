import program from 'commander'
import fs from 'fs'
import flat from 'flat'
import decamelize from 'decamelize'
import loadBuildConfig from '../index'

const loadBuildConfigAsKeyValue = (buildConfigName, platform, spaces = true, quotes = false) => {
  const buildConfig = loadBuildConfig(buildConfigName, platform)
  const xcconfigOptions = flat(buildConfig, {
    delimiter: '_',
    // Dashes are not supported in keys in xcconfigs and android resources
    transformKey: key => decamelize(key).toUpperCase().replace('-', '_')
  })
  const assignOperator = `${spaces ? ' ' : ''}=${spaces ? ' ' : ''}`

  const quoteValue = value => {
    if (quotes && value.includes('"')) {
      throw Error("Values in build configs musn't contain double quotes!")
    }

    return `${quotes ? '"' : ''}${value}${quotes ? '"' : ''}`
  }

  const prefixed = Object.keys(xcconfigOptions).map(key => {
    const value = xcconfigOptions[key]
    const escaped = typeof value === 'string' ? value.replace(/\n/g, '\\n') : value
    return `BUILD_CONFIG_${key}${assignOperator}${quoteValue(String(escaped))}`
  })
  prefixed.push(`BUILD_CONFIG_NAME${assignOperator}${quoteValue(buildConfigName)}`)
  return prefixed.join('\n')
}

program
  .command('write-xcconfig <build_config_name> <platform>')
  .requiredOption('--directory <directory>', 'the directory to put the created xcconfig file in')
  .description('create and write a new buildConfig.tmp.xcconfig to the output directory')
  .action((buildConfigName, platform, cmdObj) => {
    try {
      const xcconfig = loadBuildConfigAsKeyValue(buildConfigName, platform)
      fs.writeFileSync(`${cmdObj.directory}/buildConfig.tmp.xcconfig`, xcconfig)
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  })
program
  .command('to-properties <build_config_name> <platform>')
  .description('create and write a new properties file to the stdout')
  .action((buildConfigName, platform, cmdObj) => {
    try {
      const properties = loadBuildConfigAsKeyValue(buildConfigName, platform)
      console.log(properties)
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  })
program
  .command('to-bash <build_config_name> <platform>')
  .description('outputs the specified build config as key-value pairs which can be executed by bash')
  .action((buildConfigName, platform) => {
    const buildConfig = loadBuildConfigAsKeyValue(buildConfigName, platform, false, true)
    console.log(buildConfig)
  })
program
  .command('to-json <build_config_name> <platform>')
  .description('outputs the specified build config as JSON')
  .action((buildConfigName, platform) => {
    const buildConfig = loadBuildConfig(buildConfigName, platform)
    console.log(JSON.stringify(buildConfig))
  })
program.parse(process.argv)
