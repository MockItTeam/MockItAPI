class Project < ActiveRecord::Base
  enum status: { active: 0 }

  has_many :invitations
  has_and_belongs_to_many :members, join_table: "projects_users"
  belongs_to :owner, foreign_key: "user_id", class_name: "User"

  validates_presence_of :owner
  validates_uniqueness_of :name, message: "Project's name must be unique per user"
  validates :name,
            presence: true,
            length: { in: 3..20 },
            format: { with: /\A[a-zA-Z0-9]+\z/,
                      message: "Only a-z, A-Z, 0-9 allowed" }

  scope :pending_invitations, -> () { project.invitations.where(status: :pending) }
end
