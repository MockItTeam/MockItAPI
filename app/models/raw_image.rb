class RawImage < ActiveRecord::Base
  mount_uploader :name, ImageUploader
  enum status: { pending: 0, processed: 1, error: 2 }

  belongs_to :user

  before_save :set_default_status

  def set_default_status
    self.status = :pending
  end
end
