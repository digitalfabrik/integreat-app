import type { WebBuildConfigType } from "build-configs/BuildConfigType";
export { ThemeType } from "build-configs/ThemeType";

const buildConfig = (): WebBuildConfigType => __BUILD_CONFIG__;

export default buildConfig;