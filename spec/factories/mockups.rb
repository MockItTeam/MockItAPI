FactoryGirl.define do
  factory :mockup do
    name { FFaker::Lorem.word }
    json_elements '{"width": 500,"height": 500,"elements": [{"id": "1","type": "Button","x": 10,"y": 30,"z": 2,"width": 200,"height": 300,"text": "OK"},{"id": "2","type": "RadioButton","x": 200,"y": 200,"z": 2,"isChecked": true},{"id": "3","type": "Panel","x": 5,"y": 5,"z": 1,"width": 400,"height": 100,"childrenID": [1,2]}]}'
  end

  factory :invalid_mockup, class: 'Mockup' do
    name '#####'
  end
end
