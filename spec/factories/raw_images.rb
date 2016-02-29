FactoryGirl.define do
  factory :raw_image do
    name { Rack::Test::UploadedFile.new(File.join(Rails.root, 'spec', 'fixtures', 'assets', 'example.jpg')) }
  end
end
