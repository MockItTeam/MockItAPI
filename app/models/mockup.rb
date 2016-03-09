class Mockup < ActiveRecord::Base
  acts_as_paranoid
  enum status: %w(pending accepted refused cancelled)

  belongs_to :raw_image, dependent: :destroy
  belongs_to :owner, class_name: 'User', foreign_key: 'user_id'
  belongs_to :project

  validates_associated :project
  validates :description, length: {in: 0..100}
  validates :description, format: {with: /\A[a-zA-Z0-9\s]+\z/}

  before_create :set_default_status

  def set_default_status
    self.status = :pending
  end
end
