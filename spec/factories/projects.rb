FactoryGirl.define do
  factory :project do
    name { FFaker::Lorem.word }
    status :active
  end
end
