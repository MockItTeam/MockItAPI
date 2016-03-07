class UserSerializer < ActiveModel::Serializer
  attributes :id,
             :username,
             :created_at,
             :updated_at

  has_many :projects
  has_many :raw_images
  has_many :mockups
end
