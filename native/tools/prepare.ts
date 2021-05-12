import * as fs from 'fs'

fs.writeFileSync('src/buildConfigName.json', JSON.stringify(process.env.BUILD_CONFIG_NAME))
