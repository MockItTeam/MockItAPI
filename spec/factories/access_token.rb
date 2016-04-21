FactoryGirl.define do
  factory :access_token, class: Doorkeeper::AccessToken do
    token { SecureRandom.urlsafe_base64 }
  end
end