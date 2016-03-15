class Invitation < ActiveRecord::Base
  acts_as_paranoid
  enum status: %w(pending accepted refused)

  belongs_to :sender, class_name: 'User', foreign_key: 'sender_id'
  belongs_to :recipient, class_name: 'User', foreign_key: 'recipient_id'
  belongs_to :project

  validates_presence_of :sender, :recipient, :project
  validates_uniqueness_of :recipient_id, scope: :sender

  before_create :set_default_status
  after_save :check_status

  def self.search(options)
    query = where(nil)
    query = query.where(recipient_id: options[:user_id]) if options[:user_id].present?
    query = query.where(status: options[:status]) if options[:status].present?
    query
  end

  def check_invitation(user_id)
    self_invitation ||= self.recipient_id == user_id
    self_member ||= self.project.member_ids.include?(self.recipient_id)

    errors.add(:base, 'You are not must invite yourself') if self_invitation
    errors.add(:base, "#{self.recipient.username} are a project member already") if self_member

    !self_invitation && !self_member
  end

  private

  def set_default_status
    self.status = :pending
  end

  def check_status
    if self.status == 'accepted'
      self.project.members << self.recipient
      destroy
    end
  end
end
