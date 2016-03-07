class MockupSerializer < ActiveModel::Serializer
  attributes :id,
             :description,
             :json_elements,
             :created_at,
             :updated_at

  belongs_to :project
  belongs_to :user
  belongs_to :raw_image
end
