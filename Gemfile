# This is the Gemfile for the Fastlane config in ./fastlane/Fastfile

source "https://rubygems.org"

gem "fastlane"

gem "octokit", "~> 4.18"

plugins_path = File.join(File.dirname(__FILE__), 'fastlane', 'Pluginfile')
eval_gemfile(plugins_path) if File.exist?(plugins_path)
