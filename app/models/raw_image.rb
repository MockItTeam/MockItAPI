class RawImage < ActiveRecord::Base
  acts_as_paranoid
  mount_uploader :name, ImageUploader
  validates_processing_of :name

  belongs_to :owner, class_name: 'User', foreign_key: 'owner_id'
end
