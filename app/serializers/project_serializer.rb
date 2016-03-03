class ProjectSerializer < ActiveModel::Serializer
  attributes :id,
             :name,
             :status,
             :created_at,
             :updated_at

  has_one :owner
  has_many :members
  has_many :invitations
  has_many :mockups
end