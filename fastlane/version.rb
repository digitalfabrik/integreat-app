def next_version()
  version_config = YAML.load_file(File.join(__dir__, "../version.yml"))
  version_code = version_config['version_code']
  version_name = version_config['version_name']
  version_name_parts = version_name.split('.')

  unless version_name_parts.length === 3
    UI.crash!("version_name must have 3 parts!")
  end

  now = Time.now

  {
      new_version_code: version_code + 1,
      new_version_name: "#{now.year}.#{now.month}.#{version_name.split('.').last.to_i + 1}"
  }
end
