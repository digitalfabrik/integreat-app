require "json"

def read_build_config(build_config_name, platform, project_root='.')
  json = yarn(
      command: "workspace --silent build-configs --silent to-json #{build_config_name} #{platform}",
      project_root: project_root,
      flags: "--silent"
  )

  JSON.parse(json)
end
