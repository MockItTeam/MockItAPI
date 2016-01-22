class Project < ActiveRecord::Base
  enum status: { active: 0 }

  has_many :invitations
  has_and_belongs_to_many :members, join_table: "projects_users"
  belongs_to :owner, foreign_key: "user_id", class_name: "User"

  validates_presence_of :name, :members, :owner

  validates :name,
            length: { in: 3..20 },
            format: { with: /\A[a-zA-Z0-9]+\z/,
                      message: "Only a-z, A-Z, 0-9 allowed" }

  validate :project_name_uniqueness_per_user

  scope :pending_invitations, -> () { project.invitations.where(status: :pending) }

  def project_name_uniqueness_per_user
    if self.owner.projects.find_by(name: self.name)
      errors.add(:base, "Project's name must be unique per user")
    end
  end
end
