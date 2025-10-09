require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "ConektaReactNativeExpo"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => min_ios_version_supported }
  s.source       = { :git => "https://github.com/danxrl/conekta-react-native-expo.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,cpp}", "ios/Conekta/**/*.{h,m,mm}"
  s.public_header_files = "ios/Conekta/**/*.h"
  s.private_header_files = "ios/**/*.h"


  install_modules_dependencies(s)
end
