require "json"

Pod::Spec.new do |s|
  # NPM package specification
  package = JSON.parse(File.read(File.join(File.dirname(__FILE__), "package.json")))

  s.name         = "react-native-icure-crypto"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]["name"]
  s.platforms    = { :ios => "10.0" }
  s.source       = { :http => 'file:' + __dir__ + '/' }
  s.source_files = "ios/**/*.{h,m,swift}"
  s.swift_version = "4.2"
  s.dependency "React"

end