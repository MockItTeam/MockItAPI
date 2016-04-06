class ProjectSerializer < ActiveModel::Serializer
  attributes :id,
             :name,
             :image_url,
             :created_at,
             :updated_at

  has_one :owner
  has_many :members
  has_many :invitations
  has_many :mockups

  def image_url
    object.image.medium.url
  end
end