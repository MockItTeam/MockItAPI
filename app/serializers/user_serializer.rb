class UserSerializer < ActiveModel::Serializer
  attributes :id,
             :username,
             :status,
             :created_at,
             :updated_at

  has_many :projects
  has_many :raw_images
  has_many :invitations
  has_many :mockups
end
