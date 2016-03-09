class Project < ActiveRecord::Base
  acts_as_paranoid
  mount_uploader :image, ImageUploader

  has_many :invitations, dependent: :destroy
  has_many :mockups, dependent: :destroy
  has_and_belongs_to_many :members, class_name: 'User', dependent: :delete_all
  belongs_to :owner, class_name: 'User', foreign_key: 'user_id'

  validates_presence_of :owner
  validate :project_name_uniqueness_per_user
  validates :name,
            presence: true,
            length: { in: 3..50 },
            format: { with: /\A[a-zA-Z0-9]+\z/ }

  after_create :set_owner_to_member

  scope :pending_invitations, -> () { project.invitations.where(status: :pending) }

  private

  def set_owner_to_member
    self.members << self.owner
  end

  def project_name_uniqueness_per_user
    if self.owner.projects.find_by(name: self.name)
      errors.add(:base, "Name must be unique per user")
    end
  end
end
