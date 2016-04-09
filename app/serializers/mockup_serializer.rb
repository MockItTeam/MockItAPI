class MockupSerializer < ActiveModel::Serializer
  attributes :id,
             :name,
             :json_elements,
             :status,
             :created_at,
             :updated_at

  belongs_to :project
  belongs_to :owner
  belongs_to :raw_image
end
