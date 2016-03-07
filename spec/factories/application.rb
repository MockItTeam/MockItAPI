FactoryGirl.define do
  factory :origin_application, class: Doorkeeper::Application do
    name 'origin'
    uid 'ba5abd89ff8a5756912d9eabe18afd36dc4afadaf509cf9a89ffbb1980e13f5e8241515f4afe97b1f7d3f10d45c6f0db5c2f360589b6bc4c2705034299fcec2b'
    secret 'd05c587e7924105ca7a32e5e825f477757ea4c89b6862bcc7ad934388d6db42668d21f414c189eb01ef40837e9842ecfe2695744277d79f953d0e7de9e492d15'
    redirect_uri 'https://localhost:3000/callback'
  end
end