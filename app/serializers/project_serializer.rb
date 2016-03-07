class ProjectSerializer < ActiveModel::Serializer
  attributes :id,
             :name,
             :image,
             :created_at,
             :updated_at

  has_one :owner
  has_many :members
  has_many :invitations
  has_many :mockups

  def image
    object.image.url
  end
end