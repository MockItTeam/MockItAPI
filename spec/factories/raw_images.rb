FactoryGirl.define do
  factory :raw_image do
    name { Rack::Test::UploadedFile.new(File.join(Rails.root, 'spec', 'fixtures', 'assets', 'mockup_image.jpg')) }
  end
end
