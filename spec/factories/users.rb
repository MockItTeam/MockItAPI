FactoryGirl.define do
  factory :owner, class: 'User' do
    username 'mockit'
    password '1234'
  end

  factory :user do
    username { FFaker::Internet.domain_word.downcase }
    password '1234'
  end
end
