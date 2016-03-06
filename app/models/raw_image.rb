class RawImage < ActiveRecord::Base
  mount_uploader :name, ImageUploader
  validates_processing_of :name

  belongs_to :user
end
