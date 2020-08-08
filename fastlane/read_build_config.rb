require "json"

def read_build_config(build_config_name)
  json = yarn(
      command: "babel-node tools/build-config to-json #{build_config_name}",
      package_path: "package.json",
      flags: "--silent"
  )

  JSON.parse(json)
end
