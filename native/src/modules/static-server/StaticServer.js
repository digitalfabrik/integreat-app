// @flow

import ReactNativeStaticServer from 'react-native-static-server'
import {RESOURCE_CACHE_DIR_PATH} from "../endpoint/DatabaseConnector";

const SERVER_PATH = RESOURCE_CACHE_DIR_PATH

class StaticServer {
    server = new ReactNativeStaticServer(8080, SERVER_PATH, {localOnly: true})

    async start(): Promise<string> {
        const {url} = await this.server.start()
        return url
    }

    stop() {
        this.server.stop()
    }

}

export default StaticServer
