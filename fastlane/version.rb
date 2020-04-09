def next_version()
  version_config = YAML.load_file(File.join(__dir__, "../version.yml"))
  version_code = version_config['version_code']
  version_name = version_config['version_name']
  version_name_parts = version_name.split('.')

  unless version_name_parts.length === 3
    UI.crash!("version_name must have 3 parts!")
  end

  now = Time.now
  year = now.year
  month = now.month


  if year == version_name_parts[0].to_i && month == version_name_parts[1].to_i
    version_counter = version_name_parts.last.to_i + 1
  else
    version_counter = 0
  end

  {
      new_version_code: version_code + 1,
      new_version_name: "%d.%d.%d" % [year, month, version_counter] # e.g. 2020.4.0, 2020.4.1 ...
  }
end
