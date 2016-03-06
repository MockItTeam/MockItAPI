class Invitation < ActiveRecord::Base
  enum status: %w(pending accepted refused cancelled)

  belongs_to :from, class_name: 'User', foreign_key: 'from_user_id'
  belongs_to :to, class_name: 'User', foreign_key: 'to_user_id'
  belongs_to :project

  validates_presence_of :from, :to, :project

  before_save :set_default_status

  def set_default_status
    self.status = :pending
  end
end
