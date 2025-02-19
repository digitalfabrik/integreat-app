require "json"

def read_build_config(build_config_name, platform)
  json = `yarn workspace --silent build-configs --silent manage to-json #{build_config_name} #{platform}`
  JSON.parse(json)
end

def assert_parameters(parameters)
  if parameters.include?(nil)
    raise "'nil' passed as parameter! Aborting..."
  end
end
