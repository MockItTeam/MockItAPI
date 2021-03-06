FactoryGirl.define do
  factory :project do
    name { FFaker::Internet.domain_word }
    image { Rack::Test::UploadedFile.new(File.join(Rails.root, 'spec', 'fixtures', 'assets', 'project_image.png')) }
  end

  factory :invalid_project, class: 'Project' do
    name '#####'
  end
end
