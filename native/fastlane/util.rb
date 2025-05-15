require "json"

def read_build_config(build_config_name, platform)
  json = `yarn --cwd ../../../tools --silent app-toolbelt v0 build-config to-json #{build_config_name} #{platform}`
  JSON.parse(json)
end

def assert_parameters(parameters)
  if parameters.include?(nil)
    raise "'nil' passed as parameter! Aborting..."
  end
end
