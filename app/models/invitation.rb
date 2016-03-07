class Invitation < ActiveRecord::Base
  acts_as_paranoid
  enum status: %w(pending accepted refused cancelled)

  belongs_to :sender, class_name: 'User', foreign_key: 'from_user_id'
  belongs_to :recipient, class_name: 'User', foreign_key: 'to_user_id'
  belongs_to :project

  validates_presence_of :sender, :recipient, :project

  before_create :set_default_status

  def set_default_status
    self.status = :pending
  end
end
