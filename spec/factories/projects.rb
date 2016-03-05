FactoryGirl.define do
  factory :project do
    name { FFaker::Lorem.word }
    image { Rack::Test::UploadedFile.new(File.join(Rails.root, 'spec', 'fixtures', 'assets', 'project_image.png')) }
  end
end
