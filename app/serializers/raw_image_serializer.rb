class RawImageSerializer < ActiveModel::Serializer
  attributes :id,
             :owner,
             :image_url,
             :created_at,
             :updated_at

  belongs_to :owner

  def owner
    object.user.username
  end

  def image_url
    object.name.url
  end
end
