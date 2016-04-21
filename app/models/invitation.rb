class Invitation < ActiveRecord::Base
  acts_as_paranoid
  enum status: %w(pending accepted refused)

  belongs_to :sender, class_name: 'User', foreign_key: 'sender_id'
  belongs_to :recipient, class_name: 'User', foreign_key: 'recipient_id'
  belongs_to :project

  validates_presence_of :sender, :recipient, :project
  validates_uniqueness_of :recipient, scope: [:sender, :status, :project]
  validate :is_project_owner, :self_member_invitation, on: :create
  validate :status_transition, on: :update, if: :status_changed?

  before_create :set_default_status
  after_save :after_status_transition, if: :status_changed?

  default_scope { where(status: 0) }

  def self.search(options)
    query = where(nil)
    query = query.where(recipient_id: options[:user_id]) if options[:user_id].present?
    query = query.where(status: options[:status]) if options[:status].present?
    query
  end

  def can_change_status(user_id)
    if self.project.owner.id == user_id
      errors.add(:base, 'Project owner cannot change invitation status')
      false
    else
      true
    end
  end

  private

  def is_project_owner
    errors.add(:base, 'Cannot invite other user, because you are not project owner') unless self.sender == self.project.owner
  end

  def self_member_invitation
    if self.project.owner == self.sender
      errors.add(:base, 'You cannot invite yourself') if self.recipient == self.sender
      errors.add(:base, "#{self.recipient.username.capitalize} is a project member already") if self.project.member_ids.include?(self.recipient_id)
    end
  end

  def status_transition
    if (status_was == 'accepted' && (status == 'pending' || status == 'refused')) ||
      (status_was == 'refused' && (status == 'pending' || status == 'accepted'))
      errors.add(:status, "cannot change from #{status_was} to #{status}")
    end
  end

  def set_default_status
    self.status = :pending
  end

  def after_status_transition
    self.project.members << self.recipient if self.status == 'accepted'
    destroy
  end
end
