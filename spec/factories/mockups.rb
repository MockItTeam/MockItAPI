FactoryGirl.define do
  factory :mockup do
    description { FFaker::Lorem.word }
  end
end
