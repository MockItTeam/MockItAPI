FactoryGirl.define do
  factory :owner, class: 'User' do
    username 'mockit'
    password '1234'
  end

  factory :sender, class: 'User' do
    username 'sender'
    password '1234'
  end

  factory :recipient, class: 'User' do
    username 'recipient'
    password '1234'
  end

  factory :user do
    username { FFaker::Internet.domain_word.downcase }
    password '1234'
  end
end
