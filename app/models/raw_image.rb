class RawImage < ActiveRecord::Base
  acts_as_paranoid
  mount_uploader :name, ImageUploader
  validates_processing_of :name

  has_one :mockup
  belongs_to :owner, class_name: 'User', foreign_key: 'user_id'
end
