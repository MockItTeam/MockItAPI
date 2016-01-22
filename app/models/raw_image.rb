class RawImage < ActiveRecord::Base
  mount_uploader :name, ImageUploader
  enum status: { pending: 0, processed: 1, error: 2 }

  belongs_to :user
end
