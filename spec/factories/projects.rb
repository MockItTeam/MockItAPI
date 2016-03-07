FactoryGirl.define do
  factory :project do
    name { FFaker::Name.first_name }
    image { Rack::Test::UploadedFile.new(File.join(Rails.root, 'spec', 'fixtures', 'assets', 'project_image.png')) }
  end
end
