FactoryGirl.define do
  factory :mockit, class: 'User' do
    username 'mockit'
    password '1234'
  end

  factory :user do
    username { FFaker::Name.first_name }
    password '1234'
  end
end
