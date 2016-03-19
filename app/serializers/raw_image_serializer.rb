class RawImageSerializer < ActiveModel::Serializer
  attributes :id,
             :owner_name,
             :image_url,
             :created_at,
             :updated_at

  belongs_to :owner

  def owner_name
    object.user.username
  end

  def image_url
    object.name.url
  end
end
