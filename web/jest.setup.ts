import "raf/polyfill";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { webIntegreatTestCmsBuildConfig } from "build-configs/integreat-test-cms";
import "@testing-library/jest-dom";
import * as fs from "fs";
import * as path from "path";
configure({
  adapter: new Adapter()
});
// Setup fetch mock
global.fetch = require('jest-fetch-mock');
// Setup config mock
global.__BUILD_CONFIG__ = webIntegreatTestCmsBuildConfig;

function walkDir(dir: string, callback: (dir: string) => void) {
  fs.readdirSync(dir).forEach(f => {
    const filePath = path.join(dir, f);
    const isDirectory = fs.statSync(filePath).isDirectory();
    isDirectory ? walkDir(filePath, callback) : callback(filePath);
  });
}

// The following code automatically unmocks the modules in `mocksPath`. This is required because jest mocks all these
// modules automatically as soon as they are found
const mocksPath = 'src/__mocks__/';
const jsPath = '.js'; // This only unmocks .js files not .json for example

walkDir(mocksPath, name => {
  if (name.endsWith(jsPath)) {
    jest.unmock(name.substring(mocksPath.length, name.length - jsPath.length));
  }
});