class Project < ActiveRecord::Base
  has_many :invitations
  has_many :mockups
  has_and_belongs_to_many :members, class_name: 'User'
  belongs_to :owner, class_name: 'User', foreign_key: 'user_id'

  validates_presence_of :owner
  validates_uniqueness_of :name, message: "Project's name must be unique per user"
  validates :name,
            presence: true,
            length: { in: 3..20 },
            format: { with: /\A[a-zA-Z0-9]+\z/,
                      message: 'Only a-z, A-Z, 0-9 allowed' }

  scope :pending_invitations, -> () { project.invitations.where(status: :pending) }
end
