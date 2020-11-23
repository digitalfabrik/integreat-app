require "json"

def read_build_config(build_config_name, platform, project_root='.')
  json = yarn(
      command: "babel-node tools/build-config to-json #{build_config_name} #{platform}",
      project_root: project_root,
      flags: "--silent"
  )

  JSON.parse(json)
end
